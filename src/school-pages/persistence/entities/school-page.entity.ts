import { SchoolPageSubscriptionEntity } from '@classting/school-pages/persistence/entities/school-page-subscription.entity';
import { City } from '@classting/school-pages/usecase/enums';
import { BaseEntity } from '@libs/database/entities';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

interface ISchoolPage {
  city: City;
  name: string;
}

@Entity('school_pages')
@Unique(['city', 'name'])
export class SchoolPageEntity extends BaseEntity {
  @Column()
  public city: City;

  @Column()
  public name: string;

  @OneToMany(() => SchoolPageSubscriptionEntity, (subscription) => subscription.page)
  public subscriptions: SchoolPageSubscriptionEntity[];

  public static from(params: ISchoolPage) {
    const entity = new SchoolPageEntity();
    entity.city = params.city;
    entity.name = params.name;

    return entity;
  }
}
