import { Router } from 'express';

import validateAccessToken from '../middleware/verifyAccessToken';
import { TodoCreateSchema } from '../zod.domain/todo/todo.create.domain';
import { validateSchema } from '../middleware/validateSchema.middleware';
import { validateGetParamsForOffset, validateGetParamsForCursor } from '../middleware/validateGetParams.middleware';
import { createTodo, getATodo, updateATodo, getTodosWithOffSet, getTodosWithCursor, deleteATodo } from '../controller/todo/todo.controller';

const todoRouter = Router();

todoRouter.post('/', validateAccessToken, validateSchema(TodoCreateSchema), createTodo);

todoRouter.get('/byId/:id', validateAccessToken, getATodo);

todoRouter.patch('/:id', validateAccessToken, updateATodo);

todoRouter.get('/offset', validateAccessToken, validateGetParamsForOffset, getTodosWithOffSet);

todoRouter.get('/cursor', validateAccessToken, validateGetParamsForCursor, getTodosWithCursor);

todoRouter.delete('/:id', validateAccessToken, deleteATodo);

export default todoRouter;
