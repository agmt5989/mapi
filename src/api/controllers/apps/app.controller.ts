import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger";
import { AppService } from "./app.service";
import ApiResponse from "../../utils/ApiResponse";
import ApiStatusCodes from "../../utils/ApiStatusCodes";

export class AppController {
  private readonly logger: Logger = new Logger(
    "mono-portal:controllers/app/app.controller"
  );
  private appService: AppService;

  constructor() {
    this.appService = new AppService();
  }

  public getApps = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const accounts = await this.appService.getApps(request.user.bvn);

      if (!accounts) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.notFound,
          data: null,
          message: "Could not fetch any connected apps with Mono",
        });
      }

      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: accounts,
        message: "Retrieved connected apps successfully",
      });
    } catch (error: Error | any) {
      this.logger.log(error);
      next(error);
    }
  };

  public toggleApps = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { link, app } = request.body;
      const result = await this.appService.toggleApps(
        app,
        request.user.bvn,
        link
      );

      if (result.error) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.badRequest,
          data: null,
          message: result.message,
        });
      }
      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: null,
        message: result.message,
      });
    } catch (error: Error | any) {
      this.logger.log(error);
      next(error);
    }
  };
}
