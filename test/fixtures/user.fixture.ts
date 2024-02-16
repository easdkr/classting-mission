import { UserEntity } from '@classting/users/persistence/entities';
import { DeepPartial } from 'typeorm';

export const adminUserFixture: DeepPartial<UserEntity>[] = [
  {
    email: 'test@test.com',
    password: 'test1@',
    roleId: 1,
  },
];

export const memberUserFixture: DeepPartial<UserEntity>[] = [
  {
    email: 'member@test.com',
    password: 'test1@',
    roleId: 2,
  },
];
