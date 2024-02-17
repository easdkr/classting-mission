import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';

export class SubscribeSchoolPageResponse {
  public id: number;
  public userId: number;
  public pageId: number;

  /**
   * @example 2021-09-01T00:00:00.000Z
   */
  public createdAt: string;

  /**
   * @example 2021-09-01T00:00:00.000Z
   */
  public updatedAt: string;

  /**
   * @example 2021-09-01T00:00:00.000Z
   */
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
