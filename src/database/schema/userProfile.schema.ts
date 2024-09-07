import {
  pgTable,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import { User } from "./user.schema";
import { commonFields } from "./schemas.helper";

export const UserProfile = pgTable('profile', {
  ...commonFields(),
  userId: uuid("user_id").references(() => User.id).notNull().unique(),
  temporaryAddress: varchar("temporary_address", { length: 80 }),
  permanentAddress: varchar("permanent_address", { length: 80 }),
  profilePicture: varchar('profile_picture', { length: 500 }),
  country: varchar('country', { length: 50 }),
  designation: varchar('designation', { length: 200 }),
});
