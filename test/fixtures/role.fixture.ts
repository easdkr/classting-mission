import { Role } from '@classting/auth/usecase/enums';
import { RoleEntity } from '@classting/users/persistence/entities';
import { DeepPartial } from 'typeorm';

export const roleFixture: DeepPartial<RoleEntity>[] = [
  {
    name: Role.ADMIN,
  },
  {
    name: Role.MEMBER,
  },
];
