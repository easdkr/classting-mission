import { RoleEntity } from '@classting/users/persistence/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoleQueryRepository extends Repository<RoleEntity> {
  public constructor(private readonly dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }

  public async existsById(id: number): Promise<boolean> {
    const queryRes = await this.findOne({ where: { id } });
    return !!queryRes;
  }

  public async findAll(): Promise<RoleEntity[]> {
    const queryRes = await this.find();
    return queryRes;
  }
}
