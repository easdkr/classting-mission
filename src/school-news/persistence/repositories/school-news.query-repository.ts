import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { Maybe } from '@libs/functional';
import { EntityCondition } from '@libs/types';
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
}
