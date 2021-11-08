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

      if (result.error) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.badRequest,
          data: result.data,
          message: result.message
        });
      }
      
      const responseData = { user: result.data, 
                             token: result.data ? generateJWT(result.data) : null }

      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: responseData,
        message: result.message
      });

    } catch (error: Error | any) {
      this.logger.log(error);
      next(error)
    }
  }

  public getStarted = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const customer = await this.userService.getStarted(request.body);
      if (!customer) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.badRequest,
          data: null,
          message: 'Invalid credential, Already on Portal or does not match a Mono account'
        })
      }

      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: customer,
        message: `Email Verification Code sent to ${customer.email}`
      });

    } catch (error: Error | any) {
      this.logger.log(error.message);
      next(error)
    }
  }

  public confirmEmail = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const { email, otp } = request.body;

      const isVerified = await this.userService.confirmEmail(otp, email);

      if (!isVerified) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.badRequest,
          data: null,
          message: 'Invalid Email Verification Code'
        });
      }

      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: null,
        message: `${email} has been successfully verified to access Mono Portal`
      });
  
    } catch (error: Error | any) {
      this.logger.log(error.message);
      next(error)
    }
  }

  public createPassword = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const { password } = request.body;
      const { email } = request.query;
      if(password > 8) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.badRequest,
          data: null,
          message: 'Passwords must be greater than 8 characters'
        })
      }

      // @ts-ignore
      const result = await this.userService.createPassword(password, email);

      if (!result) {
       return ApiResponse.error({
        expressResponse: response,
        statusCode: ApiStatusCodes.badRequest,
        data: null,
        message: `Could not choose password successfully for ${email}, please ensure the email is verified`
       });
      }

      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: null,
        message: `${email} has been successfully verified to access Mono Portal`
      })

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

  public resendVerficationLink = async (request: Request, response: Response, next: NextFunction) => {
    try {

      const isSent = await this.userService.resendOTP(request.body);

      if (!isSent.error) {
        return ApiResponse.error({
          expressResponse: response,
          statusCode: ApiStatusCodes.badRequest,
          data: null,
          message: isSent.message
        });
      }

      ApiResponse.success({
        expressResponse: response,
        statusCode: ApiStatusCodes.success,
        data: null,
        message: isSent.message
      });

    } catch (error: Error | any) {
      this.logger.log(error.message);
      next(error)
    }
  }

}