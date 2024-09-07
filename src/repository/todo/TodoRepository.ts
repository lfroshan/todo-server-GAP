import db from "../../database";
import { and, desc, eq, gt } from "drizzle-orm";
import Todo from "../../database/schema/todo.schema";
import BaseDBService from "../BaseRepository";
import ITodoRepository from "../../repositoryInterface/todo/ITodoRepository";

/**
 * Repository class for managing Todo records in the database.
 * Extends the BaseDBService to provide common CRUD operations.
 */
export default class TodoRepository extends BaseDBService<typeof Todo> implements ITodoRepository<typeof Todo> {

  constructor() {
    super(Todo);
  }

  /**
   * Retrieves a list of Todo records for a user using cursor-based pagination.
   * Results are ordered by creation date in descending order.
   * 
   * @param {string} userId - The ID of the user to retrieve Todos for.
   * @param {number} limit - The number of records to retrieve.
   * @param {string} lastCursor - The cursor pointing to the last retrieved record.
   * @returns A promise that resolves to a list of Todo records.
   */
  async paginateWithCursor(userId: string, limit: number, lastCursor: string) {
    return await db.select()
      .from(Todo)
      .orderBy(desc(Todo.createdAt))
      .limit(limit)
      .where(
        and(
          eq(Todo.user, userId),
          gt(Todo.createdAt, new Date(lastCursor))
        )
      );
  }

  /**
   * Retrieves a list of Todo records for a user using offset-based pagination.
   * Results are ordered by creation date in descending order.
   * 
   * @param {string} userId - The ID of the user to retrieve Todos for.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of records per page.
   * @returns A promise that resolves to a list of Todo records.
   */
  async paginateWithOffSet(userId: string, page: number, limit: number) {
    return await db.select()
      .from(Todo)
      .orderBy(desc(Todo.createdAt))
      .limit(limit)
      .offset((page - 1) * limit)
      .where(eq(Todo.user, userId));
  }
}
