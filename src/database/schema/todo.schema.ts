import {
  boolean,
  pgTable,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import { User } from "./user.schema";
import { commonFields } from "./schemas.helper";

const Todo = pgTable("todo", {
  ...commonFields(),
  done: boolean("done").default(false),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  user: uuid("user_id").references(() => User.id).notNull(),
});

export default Todo;
