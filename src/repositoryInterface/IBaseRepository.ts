export default interface IBaseRepository<T> {
  get(): Promise<Object[]>;
  getById(id: string);
  insert(record: any);
  delete(id: string): void;
  update(id: string, data: T);
}
