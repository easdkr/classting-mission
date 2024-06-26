import { Maybe } from '@libs/functional';
import { EntityCondition } from '@libs/types';
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
    const queryRes = await this.findOne({
      where: field as FindOptionsWhere<UserEntity>,
      relations: {
        role: true,
      },
    });

    return Maybe.of(queryRes);
  }
}
