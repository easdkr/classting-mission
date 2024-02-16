import { City } from '@classting/school_pages/usecase/enums';

export interface CreateSchoolPageCommand {
  readonly name: string;
  readonly city: City;
}
