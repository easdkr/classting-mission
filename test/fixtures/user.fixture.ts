import { UserEntity } from '@classting/users/persistence/entities';
import { DeepPartial } from 'typeorm';

export const userFixture: DeepPartial<UserEntity>[] = [
  {
    email: 'test@test.com',
    password: 'test1@',
    roleId: 1,
  },
];
