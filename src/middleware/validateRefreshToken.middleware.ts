import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { Exception } from "../error/Exception";
import { ENV_CONFIGS } from "../config/envConfig";
import { STATUS_CODES } from "../constant/statusCodes";
import { ERROR_MESSAGES } from "../constant/errorMessages";

/**
 * Validates refresh token.
 */
export async function validateRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Exception(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, ENV_CONFIGS.refreshTokenKey);

    // Attach the decoded user to the request object
    req.body.userId = decoded;

    next();
  } catch (err) {
    next(err);
  }
};
