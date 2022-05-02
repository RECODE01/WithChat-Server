import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ICurrentUser {
  id: string;
  email: string;
  sub: string;
  exp: number;
}

export const CurrentUser = createParamDecorator(
  (_: any, context: ExecutionContext): ICurrentUser => {
    const req = context.switchToHttp().getRequest();
    console.log(req.user);
    return req.user;
  },
);
