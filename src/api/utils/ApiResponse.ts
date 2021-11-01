import { Response } from 'express';
import ApiStatusCodes from './ApiStatusCodes';

export default class ApiResponse {
  public static success(res: Response, status: number, data: any, message: string) {
    return res.status(status).json({
      status,
      message,
      data,
    });
  }

  public static send(res: Response, status: number, message: string, data: any = null) {
    res.status(status).send({
      status,
      message,
      data,
    });
  }

  public static error(res: Response, code: number, error: any = {}, message: string) {
    if (code === parseInt('444')) {
      return this.send(res, ApiStatusCodes.badRequest, error.message);
    }

    return this.send(res, code, message, error);
  }
}