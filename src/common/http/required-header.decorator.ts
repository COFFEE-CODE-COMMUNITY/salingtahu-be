import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../dto/common-response.dto"

export const RequiredHeader = createParamDecorator(
  (headerName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.headers[headerName.toLowerCase()];

    if (!value) {
      throw new BadRequestException(plainToInstance(CommonResponseDto, {
        message: `Missing required header: ${headerName}`,
      }));
    }

    return value;
  },
);
