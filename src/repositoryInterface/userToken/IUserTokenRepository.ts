import IBaseRepository from "../IBaseRepository";

export default interface IUserTokenRepository<T> extends IBaseRepository<T> {
  updateByUserId(userId: string, data: any);
  getUserTokenByUserId(userId: string);
}
