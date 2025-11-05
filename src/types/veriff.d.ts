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
     * Status of the response
     */
    status: string

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
     * UUID v4 of the attempt which received a status (as shown in verification.status field)
     * @example "8a9f1e20-6d3e-11ed-a6f1-0de5c95af74d"
     */
    attemptId: string

    /** Vendor data passed during session creation */
    vendorData: string | null

    /** End-user ID passed during session creation */
    endUserId: string | null

    /**
     * Verification status
     * @example "approved"
     */
    status: "approved" | "declined" | "resubmission_requested" | "review" | "expired" | "abandoned"

    /**
     * Verification code/action
     * @example 9001
     */
    code: number

    /**
     * Reason for the decision
     */
    reason: string | null

    /**
     * Detailed reasons for the decision
     */
    reasonCode: number | null

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

    /** Person information extracted from the verification */
    person: Person | null

    /** Document information extracted from the verification */
    document: Document | null

    /**
     * Additional verification data
     */
    additionalVerifiedData: AdditionalVerifiedData | null

    /**
     * Comments from the verification
     * @deprecated
     */
    comments: []

    /**
     * Marked is session was considered high risk
     * @deprecated
     */
    highRisk: boolean
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
     * Addresses associated with the person
     */
    addresses: Address[] | null

    /**
     * Occupation data from the document.
     * Optional, depending on the integration
     * @example "Software Engineer"
     */
    occupation: string

    /**
     * Employer's name from the document.
     * Optional, depending on the integration
     * @example "Tech Corp"
     */
    employer: string

    /**
     * Foreigner status field from the document.
     * Optional, depending on the integration
     * @example "Permanent Resident"
     */
    foreignerStatus: string

    /**
     * Additional name from the document.
     * Optional, depending on the integration
     * @example "Marie"
     */
    extraNames: string

    /**
     * Person's title extracted from the document.
     * Optional, depending on the integration
     * @example "Dr"
     */
    title: string

    /**
     * The voter's card identifier (OCR).
     * Optional, only for Mexican registries verification
     * @example "1234567890123"
     */
    ifeIdentifier: string | null

    /**
     * The citizen's identifier (Identificador del Ciudadano).
     * Optional, only for Mexican registries verification
     * @example "ABCD123456XYZ789"
     */
    ineIdentifier: string | null

    /**
     * Legacy field, may return incorrect result, should be ignored
     * @deprecated
     */
    pepSanctionMatch: string | null

    /**
     * Deprecated, always returns null
     * @deprecated
     */
    citizenship: null

    /**
     * Person's electoral number.
     * Optional, currently only for Mexican registry checks.
     * Present only if the data was available on the document
     * @example "ABC123456789"
     */
    electorNumber: string | null

    /**
     * Person's eye color as stated on the document.
     * Optional, present only if the data was available on the document
     * @example "BROWN"
     */
    eyeColor: string | null

    /**
     * Person's hair color as stated on the document.
     * Optional, present only if the data was available on the document
     * @example "BLACK"
     */
    hairColor: string | null

    /**
     * Person's height as stated on the document.
     * Optional, present only if the data was available on the document
     * @example "175 cm"
     */
    height: string | null

    /**
     * Person's weight as stated on the document.
     * Optional, present only if the data was available on the document
     * @example "70 kg"
     */
    weight: string | null
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
     * Object containing parts of the fullAddress value as separate keys. Optional, depending on the integration
     */
    parsedAddress: ParsedAddress
  }

  interface ParsedAddress {
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
    postcode: string | null

    /**
     * Country (ISO 3166-1 Alpha-3 country code)
     * @example "USA"
     */
    country: string | null

    /**
     * An apartment, unit, office, lot, or other secondary unit designator
     */
    unit: string | null
  }

  export interface NameComponent {
    /**
     * Person's title extracted from the document, e.g., "MR", "MS".
     * null when no title data present on the document
     * @example "MR"
     */
    title: string | null

    /**
     * Person's middle name extracted from the document, from a dedicated field on the document or document barcode results.
     * null when the first name has no suffix according to barcode data.
     * The field is not sent when the document has no dedicated field or barcode
     * @example "James"
     */
    middleName: string | null

    /**
     * Person's first name extracted from the document and stripped from all components like middleName or firstNameSuffix
     * @example "John"
     */
    firstNameOnly: string | null

    /**
     * Person's first name suffix.
     * null when the first name has no suffix according to barcode data.
     * The field is not sent when the document has no barcode
     * @example "Jr"
     */
    firstNameSuffix: string | null
  }

  /**
   * Document information extracted from verification
   */
  interface Document {
    /**
     * Document number, [a-zA-Z0-9] characters only
     * @example "B01234567"
     */
    number: string | null

    /**
     * Document type, one of PASSPORT, ID_CARD, RESIDENCE_PERMIT, DRIVERS_LICENSE, VISA, OTHER.
     * For more info, see the Supported document types for IDV article
     * @example "PASSPORT"
     */
    type: string | null

    /**
     * Document issuing country, represented as ISO 3166 alpha-2 code
     * @example "US"
     */
    country: string | null

    /**
     * Document issuing state, represented as ISO 3166 alpha-2 or alpha-3 code
     * @example "CA"
     */
    state: string | null

    /**
     * Data extracted from document's remarks field
     * @example "Special conditions apply"
     */
    remarks: string

    /**
     * Document is valid until date, represented as YYYY-MM-DD.
     * Optional, must be configured for your integration by the Solutions Engineer
     * @example "2030-01-01"
     */
    validUntil: string | null

    /**
     * Document is valid from date, represented as YYYY-MM-DD.
     * Optional, must be configured for your integration by the Solutions Engineer
     * @example "2020-01-01"
     */
    validFrom: string | null

    /**
     * Place where document was issued.
     * Optional, depending on the integration
     * @example "New York"
     */
    placeOfIssue: string | null

    /**
     * Date of document first issue, represented as YYYY-MM-DD.
     * Optional, depending on the integration
     * @example "2015-01-01"
     */
    firstIssue: string | null

    /**
     * Document issue number.
     * Optional, depending on the integration
     * @example "001"
     */
    issueNumber: string | null

    /**
     * Document issuing authority.
     * Optional, depending on the integration
     * @example "Department of State"
     */
    issuedBy: string | null

    /**
     * Indicates if the biometric document data has been successfully decoded.
     * Optional, only when NFC validation has been enabled for the integration
     * @example true
     */
    nfcValidated: boolean

    /**
     * Type of the residence permit, as shown on the document.
     * Optional, depending on the integration
     * @example "Permanent"
     */
    residencePermitType: string

    /**
     * Indicates that the portrait image is visible in the session and its quality is sufficient to perform verification.
     * Optional, depending on the integration
     * @example true
     */
    portraitIsVisible: boolean

    /**
     * Indicates that the signature is present on the document and readable to perform the verification.
     * Optional, depending on the integration
     * @example true
     */
    signatureIsVisible: boolean

    /**
     * Person's INE (Mexican voter's registry) identifier number.
     * Optional, present only if the data was available on the document
     * @example "ABCD123456XYZ789"
     */
    ineIdentifier: string | null

    /**
     * Contains additional data about the particular document type.
     * Optional, depending on integration
     */
    specimen: Specimen
  }

  export interface Specimen {
    /**
     * Indicates if the document contains a contactless chip (NFC)
     * @example true
     */
    containsContactlessChip: boolean

    /**
     * Indicates the first issue date of the identity document template, as YYYY-MM-DD
     * @example "2010-01-01"
     */
    firstIssuedDate: string

    /**
     * Indicates the last issue date of the identity document template, as YYYY-MM-DD
     * @example "2020-12-31"
     */
    lastIssuedDate: string

    /**
     * Indicates the version of the US National Institute of Standards and Technology guidelines
     * @example "2.0"
     */
    nistVersion: string

    /**
     * Indicates if the document is a digital template identity document
     * @example false
     */
    digitalDocument: boolean

    /**
     * Indicates if the driving permit is different from the standard driver's licence
     * (e.g. it is a learner's license, temporary driver's license, permit to drive boats)
     * @example false
     */
    nonStandardDrivingLicense: boolean

    /**
     * Indicates if the document is issued to a military personnel/staff or personnel's family
     * @example false
     */
    militaryDocument: boolean

    /**
     * Indicates if the document is a temporary identity document
     * @example false
     */
    temporaryEmergencyDocument: boolean

    /**
     * Indicates if it is a document that is issued exclusively to asylum seekers or refugees
     * @example false
     */
    asylumRefugeeDocument: boolean

    /**
     * Indicates if the document is under the standards of International Civil Aviation Organization
     * @example true
     */
    ICAOStandardizedDocument: boolean

    /**
     * Indicates if the identity card is not a national ID card
     * (e.g., social security card, tax ID, electoral ID)
     * @example false
     */
    notNationalIdCard: boolean

    /**
     * Indicates the legal status of the identity document in the country of issuance.
     * One of primary, secondary, tertiary, indicating to what extent the document is accepted as legal proof of identity
     * @example "primary"
     */
    legalStatus: string | null

    /**
     * Indicates if the document has properties that can increase the chance of document tampering
     * @example false
     */
    hasSecurityRisk: boolean
  }

  /**
   * Additional verified data
   * Data that has been optionally verified for the session.
   * Optional, depending on the integration
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

    /**
     * Number of the driver's license.
     * Optional, depending on the integration
     * @example "D1234567"
     */
    driversLicenseNumber: string

    /**
     * Indicates the driver's licence category/ies.
     * Optional, the presence of this property depends on drivers licence category extraction being enabled for the integration
     */
    driversLicenseCategory: DriversLicenseCategory

    /**
     * Date when the driving license category was obtained.
     * Optional, depending on the integration
     */
    driversLicenseCategoryFrom: DriversLicenseCategoryFrom

    /**
     * Driving license category expiry date.
     * Optional, depending on the integration
     */
    driversLicenseCategoryUntil: DriversLicenseCategoryUntil

    /**
     * List of category types visible on the driver's license
     */
    driversLicenseCategories: string[]

    /**
     * Estimated age.
     * Optional, depending on the integration
     * @example 30
     */
    estimatedAge: number

    /**
     * Estimated gender, values closer to 0.0 indicate 'male', values closer to 1.0 indicate 'female'.
     * Optional, depending on the integration
     * @example 0.95
     */
    estimatedGender: number

    /**
     * Array of UK DIATF checks results.
     * Optional, only for customers with Veriff UK DIATF solution
     */
    UKTFCheckResult: UKTFCheckResult[]

    /**
     * Brazilian individual taxpayer registry (CPF) validation check object.
     * Optional, only for customers with Brazilian registry checks
     */
    cpfValidation: CpfValidation | null

    /**
     * Process number (e.g., "Trámite №") from the document.
     * Optional, depending on the integration
     * @example "12345678"
     */
    processNumber: string

    /**
     * INE Biometric Database Verification check object.
     * Optional, available only when the INE Biometric Validation check has been enabled for the integration
     */
    ineBiometricRegistryValidation: IneBiometricRegistryValidation

    /**
     * Registry validation check object.
     * Optional, available only when the registry validation check has been enabled for the integration (currently available for Colombia registries)
     */
    registryValidation: RegistryValidation

    /**
     * Proof of address data.
     * Optional, available only if the Proof of Address Verification has been enabled for your integration
     */
    proofOfAddress: ProofOfAddress

    /**
     * Data that has been optionally verified for the US Database Verification session, depending on the integration.
     * Empty if no additional data was verified.
     * Optional, depending on integration
     */
    validationResults: ValidationResult[]
  }

  /**
   * Driver's license category
   */
  interface DriversLicenseCategory {
    /**
     * Category B
     */
    B: boolean | null
  }

  /**
   * Driver's license category from date
   */
  interface DriversLicenseCategoryFrom {
    /**
     * Category is valid from date, represented as YYYY-MM-DD
     * @example "2015-01-01"
     */
    B: string | null
  }

  /**
   * Driver's license category until date
   */
  interface DriversLicenseCategoryUntil {
    /**
     * Category is valid until date, represented as YYYY-MM-DD
     * @example "2030-01-01"
     */
    B: string | null
  }

  /**
   * UK DIATF check result
   */
  interface UKTFCheckResult {
    /**
     * CIFAS registry check result
     * @example "PASS"
     */
    CIFAS: string

    /**
     * UK Electoral roll and credit history check result
     * @example "PASS"
     */
    "Electoral roll and Credit History UK": string

    /**
     * PEP check result
     * @example "PASS"
     */
    PEP: string
  }

  /**
   * Brazilian CPF validation
   */
  interface CpfValidation {
    /**
     * Status of the entry in the registry, one of CPF is validated, CPF is suspended,
     * CPF holder is deceased, CPF is pending regularization, CPF is cancelled (was a duplicate),
     * Cancelled craft (meaning that it was cancelled due to reasons other than being a duplicate)
     * @example "CPF is validated"
     */
    status: string | null

    /**
     * Brazilian individual taxpayer registry (CPF) number of the person
     * @example "12345678901"
     */
    cpfNumber: string | null

    /**
     * Person's name in the CPF
     * @example "João Silva"
     */
    name: string | null

    /**
     * Person's date of birth in the CPF as YYYY-MM-DD
     * @example "1990-01-01"
     */
    dateOfBirth: string | null

    /**
     * Person's year of death in the CPF as YYYY-MM-DD
     * @example "2020-12-31"
     */
    yearOfDeath: string | null
  }

  /**
   * INE Biometric Registry Validation
   */
  interface IneBiometricRegistryValidation {
    /**
     * Indicates if the person's selfie image is a match with their image in the registry.
     * This decision is made based on the value returned in faceMatchPercentage (see below).
     * null if the check could not be completed
     * @example true
     */
    faceMatch: boolean | null

    /**
     * Indicates the level of similarity the system thinks the matched images have, in the range of 0-100.
     * Values ≥85 indicate a match; values <85 indicate that images do not match.
     * null if the check could not be completed
     * @example 92
     */
    faceMatchPercentage: number | null

    /**
     * Indicates the response received from the service provider.
     * One of success or failure; or null if the check could not be completed
     * @example "success"
     */
    responseStatus: string | null
  }

  /**
   * Registry validation
   */
  interface RegistryValidation {
    /**
     * Country of the registry
     * @example "Colombia"
     */
    countryRegistry: string

    /**
     * Name of the registry
     * @example "Registraduría Nacional del Estado Civil"
     */
    registryName: string

    /**
     * Similarity of the full name in the registry to the full name in the document
     * @example 0.98
     */
    fullNameSimilarity: number

    /**
     * Indicates if the document is valid in the registry
     * @example true
     */
    documentValid: boolean

    /**
     * Indicates if the person is alive in the registry
     * @example true
     */
    personIsAlive: boolean
  }

  /**
   * Proof of address
   */
  interface ProofOfAddress {
    /**
     * Indicates if the name on the proof of address document matches the name from the initial request data.
     * null if the check could not be completed
     * @example true
     */
    nameMatch: boolean

    /**
     * Indicates the level of similarity the matched names have, in the range of 0.00-100.00.
     * null if the check could not be completed
     * @example 95.5
     */
    nameMatchPercentage: number

    /**
     * Indicates the type of the proof of address document.
     * null if the check could not be completed
     * @example "Utility Bill"
     */
    documentType: string

    /**
     * Returns data about document integrity.
     * Available only if the fraud validation check has been enabled for your Proof of Address integration
     */
    fraud: ProofOfAddressFraud
  }

  /**
   * Proof of address fraud data
   */
  interface ProofOfAddressFraud {
    /**
     * Indicates the risk level, possible values LOW_RISK, MEDIUM_RISK, HIGH_RISK.
     * null if the check was not executed or failed
     * @example "LOW_RISK"
     */
    riskLevel: string | null

    /**
     * Short description indicating the reason behind the risk level.
     * null if the check was not executed or failed
     * @example "Document appears authentic"
     */
    reason: string | null

    /**
     * Human readable explanation of the data in the reason field.
     * null if the check was not executed or failed
     * @example "All security features are present and valid"
     */
    reasonDescription: string | null

    /**
     * Array of strings listing the factors that influenced the risk assessment.
     * Empty if the check was not executed or failed
     */
    indicators: string[]
  }

  /**
   * US Database Verification validation result
   */
  interface ValidationResult {
    /**
     * Name of the registry
     * @example "SSN Registry"
     */
    registryName: string

    /**
     * Indicates the match level of person's first name data
     * @example "MATCH"
     */
    firstName: string

    /**
     * Indicates the match level of person's last name data
     * @example "MATCH"
     */
    lastName: string

    /**
     * Indicates the match level of person's date of birth data
     * @example "MATCH"
     */
    dateOfBirth: string

    /**
     * Indicates the match level of person's address data
     * @example "MATCH"
     */
    address: string

    /**
     * Indicates the match level of person's address data, specifically city
     * @example "MATCH"
     */
    city: string

    /**
     * Indicates the match level of person's address data, specifically state
     * @example "MATCH"
     */
    state: string

    /**
     * Indicates the match level of person's address data, specifically zip code (post code)
     * @example "MATCH"
     */
    zip: string

    /**
     * Indicates the match level of person's identity number or SSN number data
     * @example "MATCH"
     */
    idNumber: string
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
