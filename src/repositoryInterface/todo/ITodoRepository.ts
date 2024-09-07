import IBaseRepository from "../IBaseRepository";

export default interface ITodoRepository<T> extends IBaseRepository<T> {
  paginateWithCursor(userId: string, limit: number, lastCursor: string);
  paginateWithOffSet(userId: string, page: number, limit: number);
}
