import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities/school-page-subscription.entity';

describe('SchoolPageSubscriptionEntity', () => {
  it('cancel', () => {
    const entity = new SchoolPageSubscriptionEntity();
    entity.id = 1;
    entity.userId = 1;
    entity.pageId = 1;
    entity.cancelledAt = null;

    entity.cancel();
    expect(entity.cancelledAt).toBeInstanceOf(Date);
  });

  it('reSubscribe', () => {
    const entity = new SchoolPageSubscriptionEntity();
    entity.id = 1;
    entity.userId = 1;
    entity.pageId = 1;
    entity.cancelledAt = new Date();

    entity.reSubscribe();
    expect(entity.cancelledAt).toBeNull();
  });

  it('isCancelled', () => {
    const entity = new SchoolPageSubscriptionEntity();
    entity.id = 1;
    entity.userId = 1;
    entity.pageId = 1;
    entity.cancelledAt = null;

    expect(entity.isCancelled()).toBe(false);

    entity.cancel();
    expect(entity.isCancelled()).toBe(true);
  });
});
