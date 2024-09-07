import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import logger from "../utils/logger";
import { Exception } from "../error/Exception";
import { ENV_CONFIGS } from "../config/envConfig";
import { ENVIRONMENT } from "../constant/environment";
import { STATUS_CODES } from "../constant/statusCodes";
import { ERROR_MESSAGES } from "../constant/errorMessages";

export default function requestErrorHandler(error: any, req: Request, res: Response, next: NextFunction): any {
  if (!error) return next();

  logger.error(error);

  if (error instanceof Exception) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message
    });
  }

  if (error instanceof ZodError) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      error: error.name,
      name: ERROR_MESSAGES.BAD_REQUEST,
      details: error.flatten()
    });
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(STATUS_CODES.FORBIDDEN).json({
      error: error.name,
      details: ERROR_MESSAGES.FORBIDDEN
    })
  }

  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    error: error.name,
    name: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    message: ENV_CONFIGS.environment === ENVIRONMENT.DEVELOPMENT ? JSON.stringify(error.stack) : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  });
}
