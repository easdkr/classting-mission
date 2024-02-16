import { City } from '@classting/school-pages/usecase/enums';

export interface CreateSchoolPageCommand {
  readonly name: string;
  readonly city: City;
}
