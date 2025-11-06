import { RequestMethod } from "@nestjs/common"
import { getMetadataStorage, ValidationOptions, ValidationTypes } from "class-validator"
import { HttpRequestContext } from "../http/http-request-context"
import type { ValidationMetadataArgs } from "class-validator/types/metadata/ValidationMetadataArgs"
import { ProviderUtil } from "../utils/provider.util"
const { ValidationMetadata } = require("class-validator/cjs/metadata/ValidationMetadata")

export function ValidateOnPost(options?: ValidationOptions): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      target: target.constructor,
      propertyName: propertyKey.toString(),
      constraints: [
        (_object: any, value: any): boolean => {
          const httpRequestContext = ProviderUtil.get<HttpRequestContext>(HttpRequestContext)

          if (httpRequestContext.get()!.method === RequestMethod.POST) return true
          else if (value === undefined) return true
          else return false
        }
      ],
      validationOptions: options || {}
    }

    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args))
  }
}
