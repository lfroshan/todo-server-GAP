import { Column, eq } from "drizzle-orm";
import { PgColumn, PgTable } from "drizzle-orm/pg-core";

import db from "../database";
import IBaseRepository from "../repositoryInterface/IBaseRepository";
import logger from "../utils/logger";

export interface PgTableWithId {
  id: PgColumn;
}

/**
 * Base Database Service common for all Drizzle Tables(Postgres).
 * This handles all the basic CRUD operation required for any tables.
 * 
 * Note:
 * 1. Extending id to make sure all the Tables contains the same id column.
 */
export default class BaseDBService<T extends PgTable & PgTableWithId> implements IBaseRepository<T> {
  private entity: T;

  constructor(entity: T) {
    this.entity = entity;
  }

  /**
   * get's a unique record from a table by id.
   * 
   * @param {string} id - uuid string of the record.
   * @returns a unique record.
   */
  async getById(id: string) {
    logger.info('Getting the id', id)
    return (await db.select().from(this.entity).where(eq(this.entity.id, id))).at(0);
  }

  /**
   * get's all the records from a table.
   * 
   * @returns all records from the table.
   * 
   * Note:
   * 1. This method is not recommended.
   */
  async get() {
    return await db.select().from(this.entity);
  }

  /**
   * insert's a record to a table.
   * 
   * @param {T} record - the record to be inserted.
   * @returns created record if any.
   */
  async insert(record: any) {
    return await db.insert(this.entity).values({ ...record }).returning();
  }

  /**
   * delete's a record by id.
   * 
   * @param {string} id - id of the record to be deleted.
   */
  async delete(id: string): Promise<void> {
    await db.delete(this.entity).where(eq(this.entity.id, id)).returning();
  }

  /**
   * update's a record by a id.
   * 
   * @param {string} id - the id of the record to be updated.
   * @param {T} record - record to be udpated.
   * @returns updated data.
   */
  async update(id: string, record: any) {
    return await db.update(this.entity).set(record).where(eq(this.entity.id, id)).returning();
  }
}
