import db from "../../database";
import { eq, or } from "drizzle-orm";

import BaseRepository from "../BaseRepository";
import { User } from "../../database/schema/user.schema";
import IUserRepository from "../../repositoryInterface/user/IUserRepository";

export default class UserRepository extends BaseRepository<typeof User> implements IUserRepository<typeof User> {
  constructor() {
    super(User);
  }

  /**
   * Retrieves a user by either their username or email.
   *
   * @param {string} userNameOrEmail - The username or email of the user.
   * @returns {Promise<any>} A promise that resolves with the user data if found.
   */
  async getByUserNameOrEmail(userNameOrEmail: string) {
    return await db.select()
      .from(User)
      .where(or(
        eq(User.email, userNameOrEmail),
        eq(User.username, userNameOrEmail)
      ));
  }
}
