import { Injectable } from "@nestjs/common"
import { User } from "../modules/user/entities/user.entity"
import { HttpService } from "@nestjs/axios"
import { ConfigService } from "@nestjs/config"
import { lastValueFrom } from "rxjs"
import { Logger } from "../infrastructure/log/logger.abstract"
import { createHmac } from "crypto"

@Injectable()
export class VeriffService {
  private readonly VERIFF_BASE_URL: string
  private readonly VERIFF_API_KEY: string

  public constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {
    this.VERIFF_BASE_URL = this.config.getOrThrow<string>("VERIFF_BASE_URL")
    this.VERIFF_API_KEY = this.config.getOrThrow<string>("VERIFF_API_KEY")
  }

  public async createVerifySession(user: User): Promise<IdentityVerifySession> {
    try {
      const body: CreateVerificationSession.Request.Body = {
        verification: {
          callback: "",
          person: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          vendorData: user.id,
        },
      }
      const { data } = await lastValueFrom(
        this.http.post<CreateVerificationSession.Response.Body, CreateVerificationSession.Request.Body>(
          `${this.VERIFF_BASE_URL}/sessions`,
          body,
          {
            headers: {
              "X-Auth-Client": this.VERIFF_API_KEY,
              "X-Hmac-Signature": this.getHmacSignature(body),
            },
          },
        ),
      )

      return {
        sessionId: data.verification.id,
        url: data.verification.url,
      }
    } catch (error) {
      this.logger.error("Error when creating Veriff verification session", error)

      throw error
    }
  }
  
  public handleDecisionWebHook() {
    
  }

  private getHmacSignature(body: object): string {
    return createHmac("sha256", this.config.getOrThrow("VERIFF_SECRET_KEY")).update(JSON.stringify(body)).digest("hex")
  }
}

export interface IdentityVerifySession {
  sessionId: string
  url: string
}

/**
 * URL source: https://devdocs.veriff.com/apidocs/v1sessions
 */
namespace CreateVerificationSession {
  export namespace Request {
    /**
     * Request body for creating a verification session
     */
    export interface Body {
      /** Verification object containing all verification details */
      verification: Verification
    }

    /**
     * Verification object containing person, document, and address information
     */
    interface Verification {
      /**
       * The callback URL to where the end-user is redirected after the verification session is completed.
       * Default is visible in the Veriff Customer Portal > Settings.
       * Changing the value in this request body will overwrite the default callback URL,
       * but it will not change the callback URL that is visible in the Customer Portal.
       * @example "https://example.com/callback"
       */
      callback?: string

      /** Data about the person being verified */
      person?: Person

      /** Data about the document of the person being verified */
      document?: Document

      /** Data about the address of the person being verified */
      address?: Address

      /** Data about the proof of address document of the person being verified */
      proofOfAddress?: ProofOfAddress

      /**
       * The unique identifier that you created for your end-user.
       * It can be max 1,000 characters long and contain only non-semantic data that can not be
       * resolved or used outside your systems or environments.
       * Veriff returns it unmodified in webhooks and API response payloads, or as null if not provided.
       * @example "1234567890"
       */
      vendorData?: string

      /**
       * The UUID that you created for your end-user, that can not be resolved or used outside
       * your systems or environments. Veriff returns it unmodified in webhooks and API response
       * payloads, or as null if not provided.
       * @example "c1de400b-1877-4284-8494-071d37916197"
       */
      endUserId?: string

      /**
       * Array of objects listing the type of consent given.
       * Optional, should be only included for features that require consent
       */
      consents?: CreateSessionConsent[]
    }

    /**
     * Person information for verification
     */
    interface Person {
      /**
       * Person's first name
       * @example "John"
       */
      firstName?: string

      /**
       * Person's last name
       * @example "Smith"
       */
      lastName?: string

      /**
       * Person's national identification number
       * @example "123456789"
       */
      idNumber?: string

      /**
       * Person's phone number
       * @example "8888888888"
       */
      phoneNumber?: string

      /**
       * Person's gender
       * @example "M"
       */
      gender?: "M" | "MALE" | "F" | "FEMALE"

      /**
       * Person's date of birth in YYYY-MM-DD format
       * @example "1990-01-01"
       */
      dateOfBirth?: string

      /**
       * Person's email address
       * @example "john.smith@example.com"
       */
      email?: string

      /**
       * Person's marital status
       * Allowed values: single, married, divorced, widowed
       * @example "single"
       */
      maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED"

      /**
       * Person's deceased status
       * @example false
       */
      isDeceased?: boolean
    }

    /**
     * Document information for verification
     */
    interface Document {
      /**
       * Document number, [a-zA-Z0-9] characters only
       * @example "B01234567"
       */
      number?: string

      /**
       * Document issuing country (ISO 3166-1 Alpha-2 country code)
       * @example "US"
       */
      country?: string

      /**
       * Document type
       * @example "PASSPORT"
       */
      type?: "ID_CARD" | "PASSPORT" | "DRIVERS_LICENSE" | "RESIDENCE_PERMIT"

      /**
       * Document type for the ID card, [a-zA-z] characters only.
       * Only required for Colombia identity verification. One of: CC, CE or TI
       * @example "CC"
       */
      idCardType?: string

      /**
       * Date of the document's first issue in YYYY-MM-DD format
       * @example "2022-01-01"
       */
      firstIssue?: string
    }

    /**
     * Address information for verification
     */
    interface Address {
      /**
       * Full address (mandatory only for UK DIATF M1B profile flow)
       * @example "123, Main Street, Your County, Anytown 12345"
       */
      fullAddress?: string
    }

    /**
     * Proof of address information
     */
    interface ProofOfAddress {
      /**
       * Accepted types for proof of address document.
       * This parameter should be sent only when using the proof of address solution
       */
      acceptableTypes: ProofOfAddressAcceptableTypes[]
    }

    /**
     * Acceptable proof of address document types
     */
    interface ProofOfAddressAcceptableTypes {
      /** Name of the acceptable proof of address type */
      name: string
    }

    /**
     * Consent information for features that require consent
     */
    interface CreateSessionConsent {
      /**
       * Indicates the feature for which the consent is given
       * @example "ine"
       */
      type: "ine" | "bipa" | "aadhaar"

      /**
       * If true, indicates that the consent has been given.
       * true is mandatory to start the INE Biometric Database Verification.
       * If false or missing, the session is not created.
       * @example true
       */
      approved: boolean
    }
  }

  export namespace Response {
    /**
     * Response body for creating a verification session
     */
    export interface Body {
      /**
       * API request status
       * @example "success"
       */
      status: string

      /** Verification object containing session details */
      verification: Verification
    }

    /**
     * Verification session details
     */
    interface Verification {
      /**
       * UUID v4 which identifies the verification session
       * @example "123e4567-e89b-12d3-a456-426614174000"
       */
      id: string

      /**
       * URL of the verification session. The end-user is redirected here to go through the flow.
       * It is a combination of the baseUrl and the sessionToken
       * @example "https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
       */
      url: string

      /**
       * The unique identifier that you created for your end-user.
       * It can be max 1,000 characters long and contain only non-semantic data that can not be
       * resolved or used outside your systems or environments.
       * Veriff returns it unmodified in webhooks and API response payloads, or as null if not provided
       * @example "1234567890"
       */
      vendorData: string | null

      /**
       * The base url the sessionToken can be used for
       * @example "https://alchemy.veriff.com"
       */
      host: string

      /**
       * Verification session status
       * @example "created"
       */
      status: string

      /**
       * Session-specific token of the verification
       * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
       */
      sessionToken: string
    }
  }
}
