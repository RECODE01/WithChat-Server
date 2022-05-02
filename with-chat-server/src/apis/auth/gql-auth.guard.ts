import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AuthAccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return req;
  }
}
