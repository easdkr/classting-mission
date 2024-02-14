import { UnauthorizedException, createParamDecorator } from '@nestjs/common';

export type SessionUser = {
  id: number;
  email: string;
};

export const User = createParamDecorator((data, ctx): { id: number; email: string } => {
  const request = ctx.switchToHttp().getRequest();
  const session = request.session;

  if (!session) throw new UnauthorizedException();

  return request.user;
});
