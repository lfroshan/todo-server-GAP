import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';

import db from '../../database';
import logger from '../../utils/logger';
import { TodoUpdate } from './todo.interface';
import { container } from '../../di/container';
import { Exception } from '../../error/Exception';
import Todo from '../../database/schema/todo.schema';
import { Return } from '../../utils/successResponse';
import { STATUS_CODES } from '../../constant/statusCodes';
import { ERROR_MESSAGES } from '../../constant/errorMessages';
import TodoRepository from '../../repository/todo/TodoRepository';
import { getSelectedTodoKeys, getTodoReqParams } from './todo.helper';
import { TodoCreatePayload } from '../../zod.domain/todo/todo.create.domain';

/**
 * Creates a Todo Record.
 *
 * @param {Request} req - The Express request object containing user data.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * @returns  A promise that resolves when the operation is complete.
 */
export async function createTodo(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body.userId;
    const createPayload: TodoCreatePayload = req.body;

    const todoService = container.resolve(TodoRepository);

    if (!userId) throw new Exception(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);

    const todo = (await todoService.insert({ ...createPayload, user: userId })).at(0);

    logger.info(`Todo Created. User Id: ${userId}`);

    Return(res, STATUS_CODES.CREATED, { ...todo });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a Todo by its ID.
 *
 * @param {Request} req - The Express request object containing the todo ID.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * @returns  A promise that resolves with the retrieved Todo data.
 */
export async function getATodo(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { userId } = req.body.userId;

    const todoService = container.resolve(TodoRepository);

    const todo = await todoService.getById(id);

    if (!todo) throw new Exception(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);

    if (todo.user !== userId) throw new Exception(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);

    logger.info(`Todo fetched. User Id: ${userId}`);

    Return(res, STATUS_CODES.OK, todo);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a list of Todos using cursor-based pagination.
 * Note: Sorting is based on the `createdAt` field by default.
 *
 * @param {Request} req - The Express request object containing pagination details.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * @returns  A promise that resolves with the list of Todos.
 */
export async function getTodosWithCursor(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body.userId;
    const { limit, lastCursor } = getTodoReqParams(req);

    const todoService = container.resolve(TodoRepository);

    const todos = await todoService.paginateWithCursor(userId, limit, lastCursor);

    logger.info(`Todos fetched with cursor pagination. User Id: ${userId}`);

    Return(res, STATUS_CODES.OK, todos);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a list of Todos using offset-based pagination.
 * Note: Sorting is based on the `createdAt` field by default.
 *
 * @param {Request} req - The Express request object containing pagination details.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * @returns  A promise that resolves with the list of Todos.
 */
export async function getTodosWithOffSet(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.body.userId;
    const { page, limit } = getTodoReqParams(req);

    const todoService = container.resolve(TodoRepository);

    const todos = await todoService.paginateWithOffSet(userId, page, limit);

    logger.info(`Todos fetched with offset pagination. User Id: ${userId}`);

    Return(res, STATUS_CODES.OK, todos);
  } catch (err) {
    next(err);
  }
}

/**
 * Updates a Todo by its ID.
 *
 * @param {Request} req - The Express request object containing the todo ID and update payload.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * @returns  A promise that resolves with the updated Todo data.
 */
export async function updateATodo(req: Request, res: Response, next: NextFunction) {
  try {
    const todoId = req.params.id;
    const { userId } = req.body.userId;
    const updatePayload: Partial<TodoUpdate> = getSelectedTodoKeys(req.body);

    const todoService = container.resolve(TodoRepository);

    if (!todoId) throw new Exception(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);

    if (!userId) throw new Exception(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);

    const todo = await todoService.getById(todoId);

    if (!todo) throw new Exception(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);

    if (todo.user !== userId) throw new Exception(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);

    const updatedTodo = await todoService.update(todoId, updatePayload);

    logger.info(`Todo Updated, todoId: ${todoId}. User Id: ${userId}`);

    Return(res, STATUS_CODES.OK, { data: updatedTodo });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a Todo by its ID.
 *
 * @param {Request} req - The Express request object containing the todo ID.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * @returns  A promise that resolves when the Todo is deleted.
 */
export async function deleteATodo(req: Request, res: Response, next: NextFunction) {
  try {
    const todoId = req.params.id;
    const { userId } = req.body.userId;

    const todoService = container.resolve(TodoRepository);

    if (!todoId) throw new Exception(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);

    if (!userId) throw new Exception(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);

    const todo = await db.select({ id: Todo.id, userId: Todo.user }).from(Todo).where(eq(Todo.id, todoId));

    if (userId !== todo.at(0)?.userId) throw new Exception(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);

    await todoService.delete(todoId);

    logger.warn(`Todo deleted. User Id: ${userId}`);

    Return(res, STATUS_CODES.OK, {});
  } catch (err) {
    next(err);
  }
}
