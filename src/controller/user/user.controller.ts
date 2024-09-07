import {
  Request,
  Response,
  NextFunction
} from "express";

import logger from "../../utils/logger";
import { container } from "../../di/container";
import { prepareUserData } from "./user.helper";
import { Exception } from "../../error/Exception";
import { Return } from "../../utils/successResponse";
import { STATUS_CODES } from "../../constant/statusCodes";
import UserRepository from "../../repository/user/UserRepository";
import { UserLoginPayload } from "../../zod.domain/user/userLogin.domain";
import ProfileRepository from "../../repository/profile/ProfileRepository";
import UserTokenRepository from "../../repository/userToken/UserTokenRepository";
import { UserRegisterPayload } from "../../zod.domain/user/userRegister.domain";
import { ERROR_MESSAGES, VALIDATION_ERROR_MESSAGES } from "../../constant/errorMessages";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/security/tokenHelper";

/**
 * User Registration Controller.
 * Creates a new user account, access token, and refresh token, and saves the tokens.
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = container.resolve(UserRepository);
    const profileService = container.resolve(ProfileRepository);
    const tokenService = container.resolve(UserTokenRepository);

    const userPayload: UserRegisterPayload = req.body;

    if (userPayload.password !== userPayload.confirmPassword)
      throw new Exception(STATUS_CODES.BAD_REQUEST, VALIDATION_ERROR_MESSAGES.PASSWORD_NOT_MATCHED);

    const userData = await prepareUserData(userPayload);

    const user = await userService.insert(userData);

    const profileCreate = profileService.insert({ userId: user.at(0)?.id })

    const accessToken = generateAccessToken(user.at(0)?.id);
    const refreshToken = generateRefreshToken(user.at(0)?.id);

    const userTokenCreate = tokenService.insert(
      {
        token: refreshToken,
        createdAt: req.body?.updatedAt,
        updatedAt: req.body?.updatedAt,
        userId: user.at(0)?.id
      });

    await Promise.all([profileCreate, userTokenCreate]);

    logger.info(`User registred. User Id: ${user.at(0)?.id}`);

    Return(res, STATUS_CODES.OK, { accessToken: accessToken, refreshToken: refreshToken })
  } catch (err) {
    next(err);
  }
};

/**
 * User Login Controller.
 * Authenticates the user, creates access and refresh tokens, and saves the refresh token.
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = container.resolve(UserRepository);
    const tokenService = container.resolve(UserTokenRepository);

    const loginPayload: UserLoginPayload = req.body;

    const user = await userService.getByUserNameOrEmail(loginPayload.username);

    if (!user.at(0)?.id) throw new Exception(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);

    if (!(await verifyToken(loginPayload.password, user)))
      throw new Exception(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);

    const accessToken = generateAccessToken(user.at(0)?.id);
    const refreshToken = generateRefreshToken(user.at(0)?.id);

    await tokenService.updateByUserId(user.at(0)?.id ?? '',
      {
        token: refreshToken,
        updatedAt: req.body?.updatedAt
      });

    logger.info(`User logged in. User Id: ${user.at(0)?.id}`);

    Return(res, STATUS_CODES.OK, { accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

/**
 * Refresh Token Controller.
 * Generates a new access token and refresh token, and saves the new refresh token.
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const tokenService = container.resolve(UserTokenRepository);

    const { userId } = req.body.userId;

    if (!userId) throw new Exception(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);

    const userToken = await tokenService.getUserTokenByUserId(userId);

    if (!userToken.at(0))
      throw new Exception(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await tokenService.updateByUserId(userId, { token: refreshToken });

    logger.warn(`User token refreshed. User Id: ${userId}`);

    Return(res, STATUS_CODES.OK, { accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

/**
 * Check if a User exists with the given username or email.
 */
export async function accountExists(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const userService = container.resolve(UserRepository);

    const user = await userService.getByUserNameOrEmail(req.body.username);

    logger.info(`Account exists? checked.`);

    if (user.at(0)?.id) throw new Exception(STATUS_CODES.CONFLICT, ERROR_MESSAGES.CONFLICT);

    Return(res, STATUS_CODES.OK, {});
  } catch (err) {
    next(err);
  }
}
