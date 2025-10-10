import { ConfigService } from "@nestjs/config"
import { firstValueFrom, lastValueFrom } from "rxjs"
import { HttpService } from "@nestjs/axios"
import { JwksClient, Options as JwksOptions } from "jwks-rsa"
import * as jwt from "jsonwebtoken"
import { BadRequestException, Injectable, NotImplementedException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { randomBytes } from "node:crypto"
import { createHash } from "crypto"
import { OAuth2Provider } from "../enums/oauth2-provider.enum"
import { Cache } from "../../../infrastructure/cache/cache"
import { User } from "../../user/entities/user.entity"
import { Readable } from "stream"
import { UserRepository } from "../../user/repositories/user.repository"
import { CreateUserDto } from "../../user/dtos/create-user.dto"
import { UserService } from "../../user/services/user.service"

export interface UserProfile {
  name: string
  email: string
  avatarUrl: string
}

export interface GoogleGetTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
  id_token: string
}

export interface GoogleJwtPayload {
  at_hash: string
  azp: string
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  name: string
  picture: string
}

export interface OAuthSession {
  state: string
  provider: OAuth2Provider
  platform: "web"
  codeVerifier?: string
}

@Injectable()
export class GoogleOAuth2Service {
  private jwksClient: JwksClient | null = null
  private readonly OAUTH2_SESSION_TTL = 300

  private get jwksOptions(): JwksOptions | null {
    return {
      jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
    }
  }

  protected get supportsPKCE(): boolean {
    return true
  }

  protected get provider(): OAuth2Provider {
    return OAuth2Provider.GOOGLE
  }

  public constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly cache: Cache,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  public async buildUrl(state: string, codeChallenge?: string): Promise<string> {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    url.searchParams.set("client_id", (await this.config.get("GOOGLE_CLIENT_ID")) ?? "")
    url.searchParams.set("redirect_uri", (await this.config.get("GOOGLE_CALLBACK_URL")) ?? "")
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "openid email profile")
    url.searchParams.set("access_type", "offline")
    url.searchParams.set("prompt", "consent")
    url.searchParams.set("state", state)

    if (codeChallenge) {
      url.searchParams.set("code_challenge", codeChallenge)
      url.searchParams.set("code_challenge_method", "S256")
    }

    return url.toString()
  }

  public async getUserProfile(code: string, codeVerifier?: string): Promise<UserProfile> {
    const tokenUrl = new URL("https://oauth2.googleapis.com/token")
    tokenUrl.searchParams.set("code", code)
    tokenUrl.searchParams.set("client_id", (await this.config.get("GOOGLE_CLIENT_ID")) ?? "")
    tokenUrl.searchParams.set("client_secret", (await this.config.get("GOOGLE_CLIENT_SECRET")) ?? "")
    tokenUrl.searchParams.set("redirect_uri", (await this.config.get("GOOGLE_CALLBACK_URL")) ?? "")
    tokenUrl.searchParams.set("grant_type", "authorization_code")

    if (codeVerifier) {
      tokenUrl.searchParams.set("code_verifier", codeVerifier)
    }

    const tokenResponse = await lastValueFrom(
      this.http.post<GoogleGetTokenResponse>("https://oauth2.googleapis.com/token", tokenUrl.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    )

    const userInfo = await this.verifyAndDecodeIdToken<GoogleJwtPayload>(tokenResponse.data.id_token, {
      audience: (await this.config.get("GOOGLE_CLIENT_ID")) ?? "",
    })

    return {
      avatarUrl: userInfo.picture || "",
      email: userInfo.email || "",
      name: userInfo.name || "",
    }
  }

  public async getAuthUrl(platform: string): Promise<string> {
    if (platform !== "web") {
      throw new NotImplementedException(
        plainToInstance(CommonResponseDto, {
          message: `${platform} OAuth2 platform currently not supported.`,
        }),
      )
    }

    // Generate secure state parameter
    const state = this.generateSecureState()

    // Generate PKCE parameters only if provider supports it
    let codeVerifier: string | undefined
    let codeChallenge: string | undefined

    if (this.supportsPKCE) {
      codeVerifier = this.generateCodeVerifier()
      codeChallenge = this.generateCodeChallenge(codeVerifier)
    }

    // Create and store session
    const session: OAuthSession = {
      state,
      provider: this.provider,
      platform,
      ...(codeVerifier && { codeVerifier }),
    }

    await this.setSession(state, session)

    // Build provider-specific auth URL
    return this.buildUrl(state, codeChallenge)
  }

  public async verify(state: string, code: string): Promise<[User, string]> {
    const session = await this.getSession(state)

    if (!session) {
      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: "Invalid OAuth session state.",
        }),
      )
    }

    const userProfile = await this.getUserProfile(code, session.codeVerifier)
    let user = await this.userRepository.findByEmail(userProfile.email)

    if (!user) {
      const userAvatar$ = this.http.get<Readable>(userProfile.avatarUrl, {
        responseType: "stream",
      })
      const userAvatar = await firstValueFrom(userAvatar$).then(response => response.data)

      const newUser = new CreateUserDto()
      newUser.name = userProfile.name
      newUser.email = userProfile.email

      user = await this.userService.createUser(newUser)
      await this.userService.putUserAvatar(user.id, userAvatar)
    }

    await this.cache.delete(state)

    return [user, session.platform]
  }

  private async verifyAndDecodeIdToken<T>(idToken: string, options?: jwt.VerifyOptions): Promise<T> {
    if (!this.jwksClient) {
      if (!this.jwksOptions) {
        throw new Error("JWKS client and options are not available.")
      }
      this.jwksClient = new JwksClient(this.jwksOptions)
    }

    const decodedHeader = jwt.decode(idToken, { complete: true }) as jwt.Jwt

    if (!decodedHeader.header.kid) {
      throw new Error("Missing 'kid' claim in ID token header.")
    }

    const signingKey = await this.jwksClient.getSigningKey(decodedHeader.header.kid)

    return jwt.verify(idToken, signingKey.getPublicKey(), options) as jwt.JwtPayload & T
  }

  private generateSecureState(): string {
    return randomBytes(32).toString("hex")
  }

  private generateCodeVerifier(): string {
    return randomBytes(32).toString("base64url")
  }

  private generateCodeChallenge(verifier: string): string {
    const hash = createHash("sha256").update(verifier).digest()
    return hash.toString("base64url")
  }

  private getSessionKey(state: string): string {
    return `oauth:google:${state}`
  }

  private async getSession(state: string): Promise<OAuthSession | null> {
    const sessionKey = this.getSessionKey(state)
    const session = await this.cache.get<OAuthSession>(sessionKey)
    return session || null
  }

  private async setSession(state: string, session: OAuthSession): Promise<void> {
    const sessionKey = this.getSessionKey(state)
    await this.cache.set(sessionKey, session, this.OAUTH2_SESSION_TTL)
  }
}
