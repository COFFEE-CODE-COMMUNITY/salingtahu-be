import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt"
import { Request } from "express"
import { Injectable } from "@nestjs/common"

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest)
  }

  public async validate(req: Request, payload: any): Promise<any> {
    const refreshToken = req.get("Authorization")?.replace("Bearer", "").trim()
    return {
      ...payload,
      refreshToken,
    }
  }
}
