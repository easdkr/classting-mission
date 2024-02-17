import { SchoolPageEntity } from '@classting/school-pages/persistence/entities/school-page.entity';
import { City } from '@classting/school-pages/usecase/enums';
import { ApiCursorResponse } from '@libs/types';

export class FindManySchoolPageResponseItem {
  public id: number;
  public city: City;
  public name: string;

  public constructor(id: number, city: City, name: string) {
    this.id = id;
    this.city = city;
    this.name = name;
  }
}

export class FindManySchoolPageResponse implements ApiCursorResponse<FindManySchoolPageResponseItem> {
  public nextCursor: number | undefined;
  public items: FindManySchoolPageResponseItem[];

  public constructor(nextCursor: number | undefined, items: FindManySchoolPageResponseItem[]) {
    this.nextCursor = nextCursor;
    this.items = items;
  }

  public static from(entities: SchoolPageEntity[], nextCursor: number | undefined): FindManySchoolPageResponse {
    const items = entities.map((entity) => new FindManySchoolPageResponseItem(entity.id, entity.city, entity.name));

    return new FindManySchoolPageResponse(nextCursor, items);
  }
}
