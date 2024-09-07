import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to validate an Express request against a given Zod schema.
 *
 * @param {AnyZodObject} schema - The Zod schema object to validate the request against.
 * @returns {Function} A middleware function that validates the request's body, query, and params. 
 * If validation fails, it returns a 400 Bad Request response with the validation error details; otherwise, 
 * it proceeds to the next middleware.
 */
export const validateSchema = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const schemaValidation = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!schemaValidation.success) return res.status(400).json(schemaValidation.error);

  return next();
};
