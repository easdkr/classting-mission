import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { SchoolPageSubscriptionQueryRepository } from '@classting/school-pages/persistence/repositories';
import { checkOrThrow } from '@libs/utils';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolPageSubscriptionService {
  public constructor(
    @InjectRepository(SchoolPageSubscriptionEntity)
    private readonly schoolPageSubscriptionRepository: Repository<SchoolPageSubscriptionEntity>,
    private readonly schoolPageSubscriptionQueryRepository: SchoolPageSubscriptionQueryRepository,
  ) {}

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
}
