import { IApiResponse } from "api/typing/IApiResponse";
import { Response } from "express";
import ApiStatusCodes from "./ApiStatusCodes";

export default class ApiResponse {
  public static success(apiResponse: IApiResponse) {
    return apiResponse.expressResponse.status(apiResponse.statusCode).json({
      status: apiResponse.statusCode,
      message: apiResponse.message,
      data: apiResponse.data,
    });
  }

  public static send(
    res: Response,
    status: number,
    message: string,
    data: any = null
  ) {
    res.status(status).send({
      status,
      message,
      data,
    });
  }

  public static error(data: IApiResponse) {
    if (data.statusCode === parseInt("444")) {
      return this.send(
        data.expressResponse,
        ApiStatusCodes.badRequest,
        data.error?.message
      );
    }

    return this.send(
      data.expressResponse,
      data.statusCode,
      data.message,
      data.error
    );
  }
}
