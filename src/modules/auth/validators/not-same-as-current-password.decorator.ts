import { Injectable } from "@nestjs/common"
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator"
import { PasswordService } from "../services/password.service"
import { PasswordResetSessionRepository } from "../repositories/password-reset-session.repository"
import { HttpRequestContext } from "../../../common/http/http-request-context"
import { TextHasher } from "../../../infrastructure/security/cryptography/text-hasher"
import { Logger } from "../../../infrastructure/log/logger.abstract"

@ValidatorConstraint({ name: "NotSameAsCurrentPassword", async: true })
@Injectable()
export class NotSameAsCurrentPasswordConstraint implements ValidatorConstraintInterface {
  public constructor(
    private readonly passwordResetSessionRepository: PasswordResetSessionRepository,
    private readonly passwordService: PasswordService,
    private readonly httpRequestContext: HttpRequestContext,
    private readonly textHasher: TextHasher,
    private readonly logger: Logger,
  ) {}

  public async validate(value: string, _validationArguments?: ValidationArguments): Promise<boolean> {
    const sessionToken = this.httpRequestContext.get()!.query.get("token") || ""
    const passwordResetSession = await this.passwordResetSessionRepository.findByToken(
      this.textHasher.hash(sessionToken),
    )

    // Because we will handle the password reset session in handler, we just return true here
    if (!passwordResetSession || passwordResetSession.isExpired()) return true

    // Check if user has a password set (OAuth users might not have passwords)
    if (passwordResetSession.user.password) {
      const isSamePassword = await this.passwordService.compare(value, passwordResetSession.user.password)
      
      this.logger.debug(`Password comparison result: ${isSamePassword}`)
      
      return !isSamePassword // Return false if passwords match (validation fails)
    }

    return true
  }

  public defaultMessage(_validationArguments?: ValidationArguments): string {
    return "New password must not be the same as the current password."
  }
}

export function NotSameAsCurrentPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions || {},
      constraints: [],
      validator: NotSameAsCurrentPasswordConstraint,
    })
  }
}
