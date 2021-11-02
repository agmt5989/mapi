import { Request, Response, NextFunction } from 'express';
import Logger from '../../utils/logger';
import { UserService } from './user.service';
import ApiResponse from '../../utils/ApiResponse';
import ApiStatusCodes from '../../utils/ApiStatusCodes';


export class UserController {

  private readonly logger: Logger = new Logger('mono-portal:controllers/user/user.controller');
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public login = async (request: Request, response: Response, next: NextFunction) => {
    try {

      
    } catch (error: Error | any) {
      this.logger.log(error);
      next(error)
    }
  }

  public getStarted = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const customer = await this.userService.getStarted(request.body);

      if (!customer) return ApiResponse.error(response, ApiStatusCodes.notFound, null, 'Customer data not found on Mono');

      ApiResponse.success(response, ApiStatusCodes.success, customer, `Email Verification Code sent to ${customer.email}`);

    } catch (error: Error | any) {
      this.logger.log(error.message);
      next(error)
    }
  }

  public confirmEmail = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const { email, otp } = request.body;

      const isVerified = await this.userService.confirmEmail(otp, email);

      if (!isVerified) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 'Invalid Email Verification Code');

      ApiResponse.success(response, ApiStatusCodes.success, null, `${email} has been successfully verified to access Mono Portal`)
 
    } catch (error: Error | any) {
      this.logger.log(error.message);
      next(error)
    }
  }

  public createPassword = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const { password, confirmPassword } = request.body;

      if(password !== confirmPassword) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 'Passwords must match'); 
      if(password > 8) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 'Passwords must be greater than 8 characters'); 

      const result = await this.userService.createPassword(password, request.params.email);

      if (!result) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 
        `Could not choose password successfully for ${request.params.email}, please ensure the email is verified`); 

      ApiResponse.success(response, ApiStatusCodes.success, null,`Successfully set password for ${request.params.email}`)

    } catch (error: Error | any) {
      this.logger.log(error.message);
      next(error)
    }
  }

  public resendVerficationLink = async (request: Request, response: Response, next: NextFunction) => 
  {

  }

}