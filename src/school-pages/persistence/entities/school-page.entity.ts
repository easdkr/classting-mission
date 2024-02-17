import { City } from '@classting/school-pages/usecase/enums';
import { BaseEntity } from '@libs/database/entities';
import { Column, Entity, Unique } from 'typeorm';

interface ISchoolPage {
  city: City;
  name: string;
}

@Entity('school_pages')
@Unique(['city', 'name'])
export class SchoolPageEntity extends BaseEntity {
  @Column()
  city: City;

  @Column()
  name: string;

  public static from(params: ISchoolPage) {
    const entity = new SchoolPageEntity();
    entity.city = params.city;
    entity.name = params.name;

    return entity;
  }
}
