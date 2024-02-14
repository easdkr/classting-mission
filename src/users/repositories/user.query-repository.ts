import { UserEntity } from '@classting/users/persistence/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserQueryRepository extends Repository<UserEntity> {
  public constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const queryRes = await this.findOne({ where: { email } });

    return !!queryRes;
  }
}
