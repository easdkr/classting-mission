import { SchoolPageEntity } from '@classting/school-pages/persistence/entities';
import { City } from '@classting/school-pages/usecase/enums';
import { DeepPartial } from 'typeorm';

export const schoolPageFixture: DeepPartial<SchoolPageEntity>[] = [
  {
    id: 1,
    city: City.SEOUL,
    name: 'Test School 1',
  },
];
