import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { Maybe } from '@libs/functional';
import { CursorResult, EntityCondition } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class SchoolNewsQueryRepository extends Repository<SchoolNewsEntity> {
  public constructor(private readonly dataSource: DataSource) {
    super(SchoolNewsEntity, dataSource.createEntityManager());
  }

  public async findUnique(field: EntityCondition<SchoolNewsEntity>): Promise<Maybe<SchoolNewsEntity>> {
    const queryRes = await this.findOne({
      where: field as FindOptionsWhere<SchoolNewsEntity>,
    });

    return Maybe.of(queryRes);
  }

  public async findMany(options: {
    limit: number;
    cursor?: number;
    field?: EntityCondition<SchoolNewsEntity>;
  }): Promise<CursorResult<SchoolNewsEntity>> {
    const query = await this.createQueryBuilder('sn')
      .limit(options.limit + 1)
      .where(options.cursor ? 'sn.id > :cursor' : '1=1', { cursor: options.cursor });

    if (options.field) query.andWhere(options.field);

    const queryRes = await query.orderBy('id', 'DESC').getMany();
    const nextCursor = queryRes.length === options.limit + 1 ? queryRes.pop().id : undefined;

    return [queryRes, nextCursor];
  }
}
