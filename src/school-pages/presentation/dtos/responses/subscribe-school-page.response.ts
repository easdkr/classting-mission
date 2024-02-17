import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';

export class SubscribeSchoolPageResponse {
  public id: number;
  public userId: number;
  public pageId: number;
  public createdAt: Date;
  public updatedAt: Date;
  public cancelledAt: Date | null;

  public static fromEntity(entity: SchoolPageSubscriptionEntity): SubscribeSchoolPageResponse {
    const response = new SubscribeSchoolPageResponse();

    response.id = entity.id;
    response.userId = entity.userId;
    response.pageId = entity.pageId;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.cancelledAt = entity.cancelledAt;

    return response;
  }
}
