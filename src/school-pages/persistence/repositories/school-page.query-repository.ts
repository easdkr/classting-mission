import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
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
  }): Promise<CursorResult<SchoolPageEntity>> {
    const query = this.createQueryBuilder('sp')
      .limit(options.limit + 1)
      .andWhere(options.cursor ? 'sp.id > :cursor' : '1=1', { cursor: options.cursor });
    if (options.field) query.andWhere(options.field);

    const queryRes = await query.orderBy('id', 'DESC').getMany();
    const nextCursor = queryRes.length === options.limit + 1 ? queryRes.pop().id : undefined;

    return [queryRes, nextCursor];
  }
}
