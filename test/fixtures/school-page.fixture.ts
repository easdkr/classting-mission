import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import { City } from '@classting/school-pages/usecase/enums';
import { DeepPartial } from 'typeorm';

export const schoolPageFixture: DeepPartial<SchoolPageEntity>[] = [
  {
    id: 1,
    city: City.SEOUL,
    name: 'Test School 1',
  },
  {
    id: 2,
    city: City.BUSAN,
    name: 'Test School 2',
  },
  {
    id: 3,
    city: City.DAEGU,
    name: 'Test School 3',
  },
];
