import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class jwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        return cookie.replace('refreshToken=', '').split(' ')[0] || '';
      },
      passReqToCallback: true,
      secretOrKey: 'f1BtnWgD3VKY',
    });
  }

  async validate(req, payload) {
    if (payload.exp < new Date().getTime() / 1000)
      throw new UnauthorizedException('만료된 토큰입니다.');
    return {
      id: payload.id,
      email: payload.email,
      sub: payload.sub,
      exp: payload.exp,
    };
  }
}
