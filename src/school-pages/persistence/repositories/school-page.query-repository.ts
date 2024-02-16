import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { Maybe } from '@libs/functional';
import { EntityCondition } from '@libs/types';
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

  public async existsById(id: number): Promise<boolean> {
    const queryRes = await this.findOne({ where: { id } });

    return !!queryRes;
  }
}
