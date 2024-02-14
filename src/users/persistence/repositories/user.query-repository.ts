import { Maybe } from '@classting/common/functional';
import { EntityCondition } from '@classting/common/types';
import { UserEntity } from '@classting/users/persistence/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UserQueryRepository extends Repository<UserEntity> {
  public constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const queryRes = await this.findOne({ where: { email } });

    return !!queryRes;
  }

  public async findUnique(field: EntityCondition<UserEntity>): Promise<Maybe<UserEntity>> {
    const queryRes = await this.findOne({ where: field as FindOptionsWhere<UserEntity> });

    return Maybe.of(queryRes);
  }
}
