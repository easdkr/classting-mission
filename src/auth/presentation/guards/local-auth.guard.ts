import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorized = await request.isAuthenticated();
    const result = (await super.canActivate(context)) as boolean;
    if (!authorized) await super.logIn(request);
    return result;
  }
}
