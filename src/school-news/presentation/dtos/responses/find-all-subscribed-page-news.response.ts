import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';
import { ApiCursorResponse } from '@libs/types';

export class FindAllSubscribedPageNewsResponseItem {
  public id: number;
  public title: string;
  public content: string;
  public pageId: number;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(id: number, title: string, content: string, pageId: number, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.pageId = pageId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class FindAllSubscribedPageNewsResponse implements ApiCursorResponse<FindAllSubscribedPageNewsResponseItem> {
  public nextCursor: number | undefined;
  public items: FindAllSubscribedPageNewsResponseItem[];

  public constructor(nextCursor: number | undefined, items: FindAllSubscribedPageNewsResponseItem[]) {
    this.nextCursor = nextCursor;
    this.items = items;
  }

  public static from(entities: SchoolNewsEntity[], nextCursor: number | undefined): FindAllSubscribedPageNewsResponse {
    const items = entities.map(
      (entity) =>
        new FindAllSubscribedPageNewsResponseItem(
          entity.id,
          entity.title,
          entity.content,
          entity.pageId,
          entity.createdAt,
          entity.updatedAt,
        ),
    );

    return new FindAllSubscribedPageNewsResponse(nextCursor, items);
  }
}
