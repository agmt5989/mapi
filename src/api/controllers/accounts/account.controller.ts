import { Request, Response, NextFunction } from 'express';
import Logger from '../../utils/logger';
import { AccountService } from './account.service';
import ApiResponse from '../../utils/ApiResponse';
import ApiStatusCodes from '../../utils/ApiStatusCodes';

export class AccountController {
  private readonly logger: Logger = new Logger('mono-portal:controllers/user/account.controller');
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  public getAccounts = async (request: Request, response: Response, next: NextFunction) => {
    try {
   
      const accounts = await this.accountService.getAccounts(request.user.bvn);

      if (!accounts) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.notFound,
          data: null,
          message: 'Could not fetch any connected account with Mono'
        })
      }

      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: accounts,
        message: 'Retrieved connected accounts successfully'
      });
      
    } catch (error: Error | any) {
      this.logger.log(error);
      next(error)
    }
  }

  public toggleAccounts = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { link, accountNumber } = request.body;
      const result = await this.accountService.toggleAccount(accountNumber, request.user.bvn, link);

      if (result.error) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.badRequest,
          data: null,
          message: result.message
        })
      }
      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: null,
        message: result.message
      });
      
    } catch (error: Error | any) {
      this.logger.log(error);
      next(error)
    }
  }
}