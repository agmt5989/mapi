import { Request, Response, NextFunction } from 'express';
import Logger from '../../utils/logger';
import { UserService } from './user.service';
import ApiResponse from '../../utils/ApiResponse';
import ApiStatusCodes from '../../utils/ApiStatusCodes';
import { generateJWT } from '../../utils';


export class UserController {

  private readonly logger: Logger = new Logger('mono-portal:controllers/user/user.controller');
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public login = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const result = await this.userService.login(request.body);

      if (result.error) return ApiResponse.error(response, ApiStatusCodes.badRequest, result.data, result.message);

      const responseData = { customer: result.data, token: result.data ? generateJWT(result.data) : null }

      ApiResponse.success(response, ApiStatusCodes.success, responseData, result.message);

      
    } catch (error: Error | any) {
      this.logger.log(error);
      next(error)
    }
  }

  public getStarted = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const customer = await this.userService.getStarted(request.body);

      if (!customer) return ApiResponse.error(response, ApiStatusCodes.notFound, null, 'Invalid credential, already used or does not match an Mono account');

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

      const { password } = request.body;
      const { email } = request.query;
      if(password > 8) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 'Passwords must be greater than 8 characters'); 

      // @ts-ignore
      const result = await this.userService.createPassword(password, email);

      if (!result) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 
        `Could not choose password successfully for ${email}, please ensure the email is verified`); 

      ApiResponse.success(response, ApiStatusCodes.success, null,`Successfully set password for ${email}`)

    } catch (error: Error | any) {
      this.logger.log(error.message);
      next(error)
    }
  }

  // public updatePassword = async (request: Request, response: Response, next: NextFunction) => {

  //   try {

  //     const { newPassword, oldPassword } = request.body;
  //     const { email } = request.user;
  //     if(newPassword > 8) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 'Passwords must be greater than 8 characters'); 

  //     // @ts-ignore
  //     const result = await this.userService.updatePassword(newPassword, oldPassword, email);

  //     if (!result) return ApiResponse.error(response, ApiStatusCodes.badRequest, null, 
  //       `Could not update password successfully for ${email}, please ensure you entered the valid old password`); 

  //     ApiResponse.success(response, ApiStatusCodes.success, null,`Successfully updated password for ${email}`)

  //   } catch (error: Error | any) {
  //     this.logger.log(error.message);
  //     next(error)
  //   }
  // }



  // TODO
  public resendVerficationLink = async (request: Request, response: Response, next: NextFunction) => {

  }

}