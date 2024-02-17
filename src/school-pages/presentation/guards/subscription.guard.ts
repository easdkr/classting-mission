import { SchoolPageSubscriptionService } from '@classting/school-pages/usecase/services';
import { SessionUser } from '@libs/decorators';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  public constructor(private readonly schoolPageSubscriptionService: SchoolPageSubscriptionService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const pageId = request.params.id;
    if (!pageId) return false;

    const userId = (request.user as SessionUser).id;
    if (!userId) return false;

    const exists = await this.schoolPageSubscriptionService.exists(+userId, +pageId);
    return exists;
  }
}
