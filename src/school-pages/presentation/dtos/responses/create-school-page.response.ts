import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';

export class CreateSchoolPageResponse {
  public id: number;
  public name: string;
  public city: string;
  public createdAt: string;
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
