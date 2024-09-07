import {
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

import { commonFields } from "./schemas.helper";

export const User = pgTable('users', {
  ...commonFields(),
  username: varchar('username', { length: 30 }).notNull().unique(),
  fullname: varchar('fullname', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 200 }).notNull(),
});
