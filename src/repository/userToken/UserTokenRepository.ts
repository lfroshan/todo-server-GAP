import db from "../../database";
import { eq } from "drizzle-orm";

import BaseDBService from "../BaseRepository";
import { UserToken } from "../../database/schema/userToken.schema";
import IUserTokenRepository from "../../repositoryInterface/userToken/IUserTokenRepository";
import logger from "../../utils/logger";

export default class UserTokenRepository extends BaseDBService<typeof UserToken> implements IUserTokenRepository<typeof UserToken> {
  constructor() {
    super(UserToken);
  }

  async updateByUserId(userId: string, data: any) {
    await db.update(UserToken)
      .set(data)
      .where(
        eq(UserToken.userId, userId)
      );
  }

  async getUserTokenByUserId(userId: string) {
    return await db.select()
      .from(UserToken)
      .where(
        eq(UserToken.userId, userId)
      );
  }
};
