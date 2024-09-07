import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

import { Exception } from "../error/Exception";
import { ENV_CONFIGS } from '../config/envConfig';
import { STATUS_CODES } from '../constant/statusCodes';
import { ERROR_MESSAGES } from '../constant/errorMessages';

/**
 * Middleware to validate the JWT access token from the Authorization header.
 *
 * @param {Request} req - The Express request object, which should contain the JWT in the Authorization header.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * @returns {Promise<void>} A promise that resolves to the next middleware or throws an error if validation fails.
 *
 * @throws {Exception} If the token is missing or invalid, it throws an exception with a 403 Forbidden status.
 *
 * @example
 * // In an Express route
 * app.get('/protected-route', validateAccessToken, (req, res) => {
 *   res.send('This is a protected route');
 * });
 */
export default async function validateAccessToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Exception(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    const decoded = jwt.verify(token, ENV_CONFIGS.accessTokenKey);

    req.body.userId = decoded;

    next();
  } catch (err) {
    next(err);
  }
};
