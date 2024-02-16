export interface ApiCursorResponse<T> {
  nextCursor: number | undefined;
  items: T[];
}
