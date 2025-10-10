import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from "passport-jwt"
import { Injectable } from "@nestjs/common"

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy) {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: false,
    } as StrategyOptionsWithoutRequest)
  }

  public async validate(payload: any): Promise<any> {
    return payload
  }
}
