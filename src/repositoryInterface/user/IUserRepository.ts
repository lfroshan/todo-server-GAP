import IBaseRepository from "../IBaseRepository";

export default interface IUserRepository<T> extends IBaseRepository<T> {
  getByUserNameOrEmail(userNameOrPassword: string);
};
