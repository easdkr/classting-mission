import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';

export class SubscribeSchoolPageResponse {
  public id: number;
  public userId: number;
  public pageId: number;
  public createdAt: string;
  public updatedAt: string;
  public cancelledAt: string | null;

  public static fromEntity(entity: SchoolPageSubscriptionEntity): SubscribeSchoolPageResponse {
    const response = new SubscribeSchoolPageResponse();

    response.id = entity.id;
    response.userId = entity.userId;
    response.pageId = entity.pageId;
    response.createdAt = entity.createdAt.toISOString();
    response.updatedAt = entity.updatedAt.toISOString();
    response.cancelledAt = entity.cancelledAt ? entity.cancelledAt.toISOString() : null;

    return response;
  }
}
