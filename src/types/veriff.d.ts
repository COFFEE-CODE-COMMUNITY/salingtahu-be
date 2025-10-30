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

// ...existing code...

/**
 * URL source: https://devdocs.veriff.com/docs/decision-webhook
 */
export namespace DecisionWebhook {
  /**
   * Decision webhook payload sent by Veriff
   */
  export interface Payload {
    /**
     * Unique identifier for the webhook event
     * @example "d57cb7e0-9e08-11ed-8d85-43e6f2e4d1ea"
     */
    id: string

    /**
     * Feature that triggered the webhook
     * @example "decision"
     */
    feature: string

    /**
     * Verification code/action
     * @example 9001
     */
    code: number

    /**
     * Action performed
     * @example "verification"
     */
    action: string

    /** Vendor data passed during session creation */
    vendorData: string | null

    /** Technical data about the verification */
    technicalData: TechnicalData

    /** Verification details */
    verification: Verification
  }

  /**
   * Technical data about the verification
   */
  interface TechnicalData {
    /**
     * IP address of the end-user
     * @example "186.123.45.67"
     */
    ip: string
  }

  /**
   * Verification details
   */
  interface Verification {
    /**
     * Verification session ID
     * @example "7b58a5e0-6d3e-11ed-a6f1-0de5c95af74d"
     */
    id: string

    /**
     * Verification code
     * @example 9001
     */
    code: number

    /** Person information extracted from the verification */
    person: Person | null

    /** Document information extracted from the verification */
    document: Document | null

    /**
     * Verification status
     * @example "approved"
     */
    status: "approved" | "declined" | "resubmission_requested" | "expired" | "abandoned"

    /**
     * Reason for the decision
     */
    reason: string | null

    /**
     * Detailed reasons for the decision
     */
    reasonCode: number | null

    /**
     * Comments from the verification
     */
    comments: Comment[] | null

    /**
     * Additional verification data
     */
    additionalVerifiedData: AdditionalVerifiedData | null

    /**
     * Timestamp when the decision was made
     * @example "2023-01-19T11:23:45.678Z"
     */
    decisionTime: string

    /**
     * Timestamp when the session was accepted
     * @example "2023-01-19T11:20:12.345Z"
     */
    acceptanceTime: string
  }

  /**
   * Person information extracted from verification
   */
  interface Person {
    /**
     * First name
     * @example "John"
     */
    firstName: string | null

    /**
     * Last name
     * @example "Smith"
     */
    lastName: string | null

    /**
     * Full name
     * @example "John Smith"
     */
    fullName: string | null

    /**
     * Date of birth in YYYY-MM-DD format
     * @example "1990-01-01"
     */
    dateOfBirth: string | null

    /**
     * ID number
     * @example "123456789"
     */
    idNumber: string | null

    /**
     * Gender
     * @example "M"
     */
    gender: string | null

    /**
     * Nationality (ISO 3166-1 Alpha-3 country code)
     * @example "USA"
     */
    nationality: string | null

    /**
     * Place of birth
     * @example "New York"
     */
    placeOfBirth: string | null

    /**
     * Pepper ID (unique identifier)
     * @example "abc123def456"
     */
    pepperID: string | null
  }

  /**
   * Document information extracted from verification
   */
  interface Document {
    /**
     * Document number
     * @example "B01234567"
     */
    number: string | null

    /**
     * Document type
     * @example "PASSPORT"
     */
    type: string | null

    /**
     * Document issuing country (ISO 3166-1 Alpha-3 country code)
     * @example "USA"
     */
    country: string | null

    /**
     * Document valid from date in YYYY-MM-DD format
     * @example "2020-01-01"
     */
    validFrom: string | null

    /**
     * Document valid until date in YYYY-MM-DD format
     * @example "2030-01-01"
     */
    validUntil: string | null
  }

  /**
   * Comment from verification
   */
  interface Comment {
    /**
     * Comment type
     * @example "DOCUMENT_QUALITY"
     */
    type: string

    /**
     * Comment text
     * @example "Document image quality is insufficient"
     */
    text: string
  }

  /**
   * Additional verified data
   */
  interface AdditionalVerifiedData {
    /**
     * Address information
     */
    address: Address | null

    /**
     * Additional document data
     */
    additionalDocumentData: AdditionalDocumentData | null
  }

  /**
   * Address information
   */
  interface Address {
    /**
     * Full address
     * @example "123 Main St, Anytown, ST 12345"
     */
    fullAddress: string | null

    /**
     * Street
     * @example "Main St"
     */
    street: string | null

    /**
     * City
     * @example "Anytown"
     */
    city: string | null

    /**
     * State/Province
     * @example "ST"
     */
    state: string | null

    /**
     * Postal code
     * @example "12345"
     */
    postalCode: string | null

    /**
     * Country (ISO 3166-1 Alpha-3 country code)
     * @example "USA"
     */
    country: string | null
  }

  /**
   * Additional document data
   */
  interface AdditionalDocumentData {
    /**
     * Document issuing authority
     * @example "Department of State"
     */
    issuingAuthority: string | null

    /**
     * Machine readable zone line 1
     */
    mrzLine1: string | null

    /**
     * Machine readable zone line 2
     */
    mrzLine2: string | null

    /**
     * Machine readable zone line 3
     */
    mrzLine3: string | null
  }
}
