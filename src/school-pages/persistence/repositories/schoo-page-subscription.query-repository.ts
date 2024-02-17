import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities';
import { Maybe } from '@libs/functional';
import { EntityCondition } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, IsNull, Repository } from 'typeorm';
@Injectable()
export class SchoolPageSubscriptionQueryRepository extends Repository<SchoolPageSubscriptionEntity> {
  public constructor(private readonly dataSource: DataSource) {
    super(SchoolPageSubscriptionEntity, dataSource.createEntityManager());
  }

  public async existsByFields(field: EntityCondition<SchoolPageSubscriptionEntity>): Promise<boolean> {
    const queryRes = await this.findOne({ where: this.parseWhereClause(field), select: { id: true } });

    return !!queryRes;
  }

  public async findUnique(
    field: EntityCondition<SchoolPageSubscriptionEntity>,
  ): Promise<Maybe<SchoolPageSubscriptionEntity>> {
    const queryRes = await this.findOne({ where: this.parseWhereClause(field) });

    return Maybe.of(queryRes);
  }

  private parseWhereClause(
    field: EntityCondition<SchoolPageSubscriptionEntity>,
  ): FindOptionsWhere<SchoolPageSubscriptionEntity> {
    const whereClause: FindOptionsWhere<SchoolPageSubscriptionEntity> = {};

    for (const key in field) {
      if (Object.prototype.hasOwnProperty.call(field, key)) {
        const value = field[key];
        whereClause[key] = value === null ? IsNull() : value;
      }
    }

    return whereClause;
  }
}
