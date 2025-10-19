import { INestApplication } from '@nestjs/common';
import { RegisterDto } from '../src/modules/auth/dto/register.dto';
import { LoginDto } from '../src/modules/auth/dto/login.dto';
import { App } from 'supertest/types';
import { LoginResponseDto } from '../src/modules/auth/dto/login-response.dto';
import { UserDto } from '../src/modules/user/dto/user.dto';
import { faker } from '@faker-js/faker';
import request from "supertest"

export async function getAuthUser(app: INestApplication<App>): Promise<GetAuthUserResult> {
  const registerDto = new RegisterDto();
  registerDto.firstName = faker.person.firstName();
  registerDto.lastName = faker.person.lastName();
  registerDto.email = faker.internet.email();
  registerDto.password = faker.internet.password({ length: 12 });

  const loginDto = new LoginDto()
  loginDto.email = registerDto.email
  loginDto.password = registerDto.password

  await request(app.getHttpServer())
    .post("/api/v1/auth/register")
    .send(registerDto)

  const loginResponse = await request(app.getHttpServer())
    .post("/api/v1/auth/login")
    .set("User-Agent", faker.internet.userAgent())
    .send(loginDto)

  const { accessToken } = loginResponse.body as LoginResponseDto

  const getCurrentUserResponse = await request(app.getHttpServer())
    .get("/api/v1/users/me")
    .set("Authorization", "Bearer " + accessToken)

  return {
    accessToken,
    user: getCurrentUserResponse.body as UserDto
  }
}

export interface GetAuthUserResult {
  accessToken: string
  user: UserDto
}
