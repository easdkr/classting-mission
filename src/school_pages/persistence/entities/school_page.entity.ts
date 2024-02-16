import { City } from '@classting/school_pages/usecase/enums';
import { BaseEntity } from '@libs/database/entities';
import { Column, Entity } from 'typeorm';

@Entity('school_pages')
export class SchoolPageEntity extends BaseEntity {
  @Column()
  city: City;

  @Column()
  name: string;
}
