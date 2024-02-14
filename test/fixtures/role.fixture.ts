import { RoleEntity } from '@classting/users/persistence/entities';
import { DeepPartial } from 'typeorm';

export const roleFixture: DeepPartial<RoleEntity>[] = [
  {
    name: 'admin',
  },
  {
    name: 'member',
  },
];
