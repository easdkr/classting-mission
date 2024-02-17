import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageSubscriptionQueryRepository } from '@classting/school-pages/persistence/repositories';
import { checkOrThrow } from '@libs/utils';
import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolPageSubscriptionService {
  public constructor(
    @InjectRepository(SchoolPageSubscriptionEntity)
    private readonly schoolPageSubscriptionRepository: Repository<SchoolPageSubscriptionEntity>,
    private readonly schoolPageSubscriptionQueryRepository: SchoolPageSubscriptionQueryRepository,
  ) {}

  public async exists(userId: number, pageId: number): Promise<boolean> {
    return this.schoolPageSubscriptionQueryRepository.existsByFields({ userId, pageId, cancelledAt: null });
  }

  public async subscribe(userId: number, pageId: number): Promise<SchoolPageSubscriptionEntity> {
    const exists = await this.schoolPageSubscriptionQueryRepository.existsByFields({
      userId,
      pageId,
      cancelledAt: null,
    });
    checkOrThrow(!exists, new ConflictException('Already subscribed'));

    const subscription = SchoolPageSubscriptionEntity.from({ userId, pageId });

    return this.schoolPageSubscriptionRepository.save(subscription);
  }

  public async unsubscribe(userId: number, pageId: number): Promise<boolean> {
    const subscription = await this.schoolPageSubscriptionQueryRepository
      .findUnique({
        userId,
        pageId,
        cancelledAt: null,
      })
      .then((v) => v.getOrThrow(new UnprocessableEntityException('Not subscribed')));

    subscription.cancel();

    return !!(await this.schoolPageSubscriptionRepository.save(subscription));
  }
}
