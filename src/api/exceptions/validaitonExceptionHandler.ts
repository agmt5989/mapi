import apiStatusCodes from '../utils/ApiStatusCodes';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validation';

export function validationErrorWrapper(err, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  return res.status(apiStatusCodes.serverError).json(err)
}