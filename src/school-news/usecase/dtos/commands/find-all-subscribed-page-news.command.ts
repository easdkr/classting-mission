export interface FindAllSubscribedPageNewsCommand {
  userId: number;
  limit: number;
  cursor?: number;
}
