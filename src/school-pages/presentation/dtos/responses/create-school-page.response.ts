import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import { City } from '@classting/school-pages/usecase/enums';

export class CreateSchoolPageResponse {
  public id: number;
  public name: string;
  public city: City;

  /**
   * @example 2021-09-01T00:00:00.000Z
   */
  public createdAt: string;

  /**
   * @example 2021-09-01T00:00:00.000Z
   */
  public updatedAt: string;

  public constructor(params: CreateSchoolPageResponse) {
    this.id = params.id;
    this.name = params.name;
    this.city = params.city;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  public static fromEntity(entity: SchoolPageEntity): CreateSchoolPageResponse {
    return new CreateSchoolPageResponse({
      id: entity.id,
      name: entity.name,
      city: entity.city,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    });
  }
}
