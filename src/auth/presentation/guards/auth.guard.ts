import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const authorized = await request.isAuthenticated();

    if (!authorized) {
      response.cookie('_sid_', '', { maxAge: 0 });

      return false;
    }

    return true;
  }
}
