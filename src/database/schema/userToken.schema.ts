import {
  uuid,
  varchar,
  pgTable,
} from "drizzle-orm/pg-core";

import { User } from "./user.schema";
import { commonFields } from "./schemas.helper";

export const UserToken = pgTable('user_token', {
  ...commonFields(),
  token: varchar('token', { length: 400 }).notNull(),
  userId: uuid('user_id').references(() => User.id).notNull().unique(),
});
