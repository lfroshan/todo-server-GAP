import {
  Request,
  Response,
  NextFunction
} from "express";

import { getUTCDate } from "../utils/date";

/**
 * Middleware to add a `updatedAt` timestamp to the request body for PATCH requests.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @description This middleware automatically adds a `updatedAt` property with the current UTC date to the `req.body` if the HTTP method is `PATCH`. This is useful for keeping track of modification timestamps in update operations.
 *
 * @example
 * app.patch('/update', addModifiedDateToRequestData, (req, res) => {
 *   // The req.body will now contain the updatedAt field with the current date.
 *   res.send('Record updated');
 * });
 */
export const addModifiedDateToRequestData = (req: Request, res: Response, next: NextFunction) => {
  // This will be saved in every request record.
  if (req.method === "PATCH") {
    req.body.updatedAt = getUTCDate();
  }

  next();
};
