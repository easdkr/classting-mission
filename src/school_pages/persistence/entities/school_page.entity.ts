import { City } from '@classting/school_pages/usecase/enums';
import { BaseEntity } from '@libs/database/entities';
import { Column, Entity } from 'typeorm';

interface ISchoolPage {
  city: City;
  name: string;
}

@Entity('school_pages')
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
