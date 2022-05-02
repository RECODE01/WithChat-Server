import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class jwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'f1BtnWgD3VKY',
      passReqToCallback: true,
    });
  }

  async validate(_, payload) {
    // console.log(payload);
    if (payload.exp < new Date().getTime() / 1000)
      throw new UnauthorizedException('만료된 토큰입니다.');
    console.log({
      id: payload.id,
      email: payload.email,
      sub: payload.sub,
      exp: payload.exp,
    });
    return {
      id: payload.id,
      email: payload.email,
      sub: payload.sub,
      exp: payload.exp,
    };
  }
}
