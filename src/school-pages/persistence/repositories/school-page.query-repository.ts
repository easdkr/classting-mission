import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import { Maybe } from '@libs/functional';
import { CursorResult, EntityCondition } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class SchoolPageQueryRepository extends Repository<SchoolPageEntity> {
  public constructor(private readonly dataSource: DataSource) {
    super(SchoolPageEntity, dataSource.createEntityManager());
  }

  public async findUnique(field: EntityCondition<SchoolPageEntity>): Promise<Maybe<SchoolPageEntity>> {
    const queryRes = await this.findOne({
      where: field as FindOptionsWhere<SchoolPageEntity>,
    });

    return Maybe.of(queryRes);
  }

  public async existsByFields(field: EntityCondition<SchoolPageEntity>): Promise<boolean> {
    const queryRes = await this.findOne({ where: field as FindOptionsWhere<SchoolPageEntity>, select: { id: true } });

    return !!queryRes;
  }

  /**
   * @returns [SchoolPageEntity[], nextCursor]
   */
  public async findMany(options: {
    limit: number;
    cursor?: number;
    field?: EntityCondition<SchoolPageEntity>;
    onlySubscribed?: { userId: number };
  }): Promise<CursorResult<SchoolPageEntity>> {
    const query = this.createQueryBuilder('sp')
      .limit(options.limit + 1)
      .where(options.cursor ? 'sp.id > :cursor' : '1=1', { cursor: options.cursor });

    if (options.field) query.andWhere(options.field);

    if (options.onlySubscribed) {
      query
        .leftJoin('sp.subscriptions', 'sub')
        .andWhere('sub.userId = :userId', { userId: options.onlySubscribed.userId });
    }

    console.log(query.getSql(), query.getParameters());
    const queryRes: any = await query
      .orderBy('sp.id', 'DESC')
      .getMany()
      .catch((err) => {
        console.error(err);
      });
    const nextCursor = queryRes.length === options.limit + 1 ? queryRes.pop().id : undefined;

    return [queryRes, nextCursor];
  }
}
