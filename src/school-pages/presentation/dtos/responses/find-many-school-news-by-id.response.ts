import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { ApiCursorResponse } from '@libs/types';

export class FindManySchoolNewsByIdResponseItem {
  public id: number;
  public title: string;
  public content: string;
  public pageId: number;

  public constructor(id: number, title: string, content: string, pageId: number) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.pageId = pageId;
  }
}

export class FindManySchoolNewsByIdResponse implements ApiCursorResponse<FindManySchoolNewsByIdResponseItem> {
  public nextCursor: number | undefined;
  public items: FindManySchoolNewsByIdResponseItem[];

  public constructor(nextCursor: number | undefined, items: FindManySchoolNewsByIdResponseItem[]) {
    this.nextCursor = nextCursor;
    this.items = items;
  }

  public static from(entities: SchoolNewsEntity[], nextCursor: number | undefined): FindManySchoolNewsByIdResponse {
    const items = entities.map(
      (entity) => new FindManySchoolNewsByIdResponseItem(entity.id, entity.title, entity.content, entity.pageId),
    );

    return new FindManySchoolNewsByIdResponse(nextCursor, items);
  }
}
