import { SchoolNewsEntity } from '@classting/school-news/persistence/entities';

export class UpdateSchoolNewsResponse {
  public id: number;
  public title: string;
  public content: string;
  public pageId: number;
  public createdAt: string;
  public updatedAt: string;

  public constructor(params: UpdateSchoolNewsResponse) {
    this.id = params.id;
    this.title = params.title;
    this.content = params.content;
    this.pageId = params.pageId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  public static fromEntity(entity: SchoolNewsEntity): UpdateSchoolNewsResponse {
    return new UpdateSchoolNewsResponse({
      id: entity.id,
      title: entity.title,
      content: entity.content,
      pageId: entity.pageId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    });
  }
}
