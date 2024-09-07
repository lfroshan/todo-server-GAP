import { timestamp, uuid } from "drizzle-orm/pg-core";

import { getUTCDate } from "../../utils/date";

export const commonFields = () => {
  return {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: false }).default(getUTCDate()),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false }).default(getUTCDate())
  };
};
