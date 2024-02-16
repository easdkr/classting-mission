import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { Maybe } from '@libs/functional';
import { CursorResult, EntityCondition } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, FindOptionsWhere, Repository } from 'typeorm';

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

  public async findSubscribedPageNews(options: {
    userId: number;
    limit: number;
    cursor?: number;
    includeCancelled: boolean;
  }): Promise<CursorResult<SchoolNewsEntity>> {
    const subQuery = this.createQueryBuilder('sn')
      .select('sn.id', 'id')
      .leftJoin('sn.page', 'sp')
      .leftJoin('sp.subscriptions', 'sub')
      .where('sub.userId = :userId', { userId: options.userId })
      .andWhere('sub.createdAt <= sn.createdAt')
      .andWhere(options.cursor ? 'sn.id <= :cursor' : '1=1', { cursor: options.cursor })
      .orderBy('sn.id', 'DESC')
      .limit(options.limit + 1);

    if (!options.includeCancelled) {
      subQuery.andWhere('sub.cancelledAt IS NULL');
    } else {
      subQuery.andWhere(
        new Brackets((qb) => qb.orWhere('sub.cancelledAt IS NULL').orWhere('sub.cancelledAt >= sn.createdAt')),
      );
    }

    const queryRes = await this.createQueryBuilder('sn')
      .where(`sn.id IN (${subQuery.getQuery()})`)
      .setParameters({ ...subQuery.getParameters() })
      .orderBy('id', 'DESC')
      .getMany();

    const nextCursor = queryRes.length === options.limit + 1 ? queryRes.pop().id : undefined;

    return [queryRes, nextCursor];
  }
}
