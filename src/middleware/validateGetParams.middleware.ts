import { Request, Response, NextFunction } from 'express';

import { Exception } from '../error/Exception';
import { STATUS_CODES } from '../constant/statusCodes';
import { CUSTOM_ERROR_MESSAGES } from '../constant/errorMessages';
import { ALLOWED_SORT_FIELD_KEYS, allowedSortFields } from '../constant/allowedSortFields';

/**
 * Validates the Params in request for get request.
 * Note: Use only for offset pagination.
 */
export async function validateGetParamsForOffset(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const sortBy = req.query.sort as string ?? ALLOWED_SORT_FIELD_KEYS.CREATED_AT;

    if (!allowedSortFields.includes(sortBy))
      throw new Exception(STATUS_CODES.BAD_REQUEST, CUSTOM_ERROR_MESSAGES.SORT_KEY_NOT_ALLOWED);
  } catch (err) {
    next(err);
  }

  next();
};

/**
 * Validates the Params in request for get request.
 * Note: Use only for cursor pagination.
 */
export async function validateGetParamsForCursor(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const sortBy = req.query.sort as string ?? ALLOWED_SORT_FIELD_KEYS.CREATED_AT;

    if (!allowedSortFields.includes(sortBy))
      throw new Exception(STATUS_CODES.BAD_REQUEST, CUSTOM_ERROR_MESSAGES.SORT_KEY_NOT_ALLOWED);
  } catch (err) {
    next(err);
  }

  next();
};
