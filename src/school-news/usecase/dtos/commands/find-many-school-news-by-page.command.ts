export interface FindManySchoolNewsByPageCommand {
  pageId: number;
  limit: number;
  cursor?: number;
}
