import { Role } from '@classting/auth/usecase/enums';
import { UnauthorizedException, createParamDecorator } from '@nestjs/common';

export type SessionUser = {
  id: number;
  email: string;
  role: Role;
};

export const User = createParamDecorator((data, ctx): SessionUser => {
  const request = ctx.switchToHttp().getRequest();
  const session = request.session;

  if (!session) throw new UnauthorizedException();

  return request.user;
});
