import { SchoolPageEntity, SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { Maybe } from '@libs/functional';
import { EntityCondition } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class SchoolPageSubscriptionQueryRepository extends Repository<SchoolPageSubscriptionEntity> {
  public constructor(private readonly dataSource: DataSource) {
    super(SchoolPageSubscriptionEntity, dataSource.createEntityManager());
  }

  public async existsByFields(field: EntityCondition<SchoolPageSubscriptionEntity>): Promise<boolean> {
    const queryRes = await this.findOne({ where: field as FindOptionsWhere<SchoolPageEntity>, select: { id: true } });

    return !!queryRes;
  }

  public async findUnique(
    field: EntityCondition<SchoolPageSubscriptionEntity>,
  ): Promise<Maybe<SchoolPageSubscriptionEntity>> {
    const queryRes = await this.findOne({ where: field as FindOptionsWhere<SchoolPageSubscriptionEntity> });

    return Maybe.of(queryRes);
  }
}
