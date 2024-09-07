import { Request } from "express";
import { TodoUpdate } from "./todo.interface";
import { ENV_CONFIGS } from "../../config/envConfig";

/**
 * Extracts and returns pagination and sorting parameters from the request query.
 *
 * @param {Request} req - The request object containing query parameters.
 * @returns {Object} An object containing the page number, limit, sortBy field, and lastCursor.
 */
export function getTodoReqParams(req: Request) {
  const page = parseInt(req.query.page as string, 10) || ENV_CONFIGS.paginationDefaultPage;
  const limit = parseInt(req.query.limit as string, 10) || ENV_CONFIGS.paginationDefaultSize;
  const sortBy: string = req.query.sort as string || 'created_at';
  const lastCursor: string = req.query.lastCursor as string;

  return { page, limit, sortBy, lastCursor };
}

/**
 * Filters and returns only the allowed keys from the provided payload.
 *
 * @param {any} payload - The payload object containing keys and values.
 * @returns {Partial<TodoUpdate>} An object containing only the allowed keys from the payload.
 */
export function getSelectedTodoKeys(payload: any): Partial<TodoUpdate> {
  const allowedKeys: Array<keyof TodoUpdate> = ['title', 'description', 'done', 'updatedAt'];

  return Object.fromEntries(
    allowedKeys.map((key) => [key, payload[key]])
  );
}
