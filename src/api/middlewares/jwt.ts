import { Request, Response, NextFunction } from 'express';
import { TTokenPayload } from '../typing/IUser';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Logger from '../utils/logger';
import ApiResponse from '../utils/ApiResponse';
import ApiStatusCodes from '../utils/ApiStatusCodes';

const logger = new Logger('mono-portal:middlewares/jwt')

const JWT_SECRET = process.env.JWT_SECRET || 'A5KPb64mdHfad1J5';

export const JWT = (req: Request, res: Response, next: NextFunction) => {
  let authToken =
  req.body.token ||
  req.query.token ||
  req.headers['x-access-token'] ||
  req.headers.Authorization ||
  req.headers.authorization;

authToken = authToken.split(' ')[0] === 'Bearer' ? authToken.split(' ')[1] : authToken;

if (!authToken) {
  return ApiResponse.error(res, ApiStatusCodes.unAuthorized, null, 'token must be provided');
}

try {
  const decoded: JwtPayload | null | string = jwt.decode(authToken) as JwtPayload;
  // @ts-ignore
  const expired = Date.now() >= decoded?.exp * 1000;

  if (expired) return ApiResponse.error(res, ApiStatusCodes.unAuthorized, null, 'token has expired');

  const verified = jwt.verify(authToken, JWT_SECRET);

  if (!verified) return ApiResponse.error(res, ApiStatusCodes.unAuthorized, null, 'invalid token provided');
  
  // @ts-ignore
  req.user = decoded;
  next();
} catch (error) {
  return ApiResponse.error(res, ApiStatusCodes.serverError, null, error.message);
}
}