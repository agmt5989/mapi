import { Request, Response, NextFunction } from 'express';
import Logger from '../../utils/logger';
import { UserService } from './user.service';


export class UserController {

  private readonly logger: Logger = new Logger('mono-portal:controllers/user/user.controller');
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async login(request: Request, response: Response, next: NextFunction) {
    try {

      
    } catch (error: Error | any) {
      if (error instanceof Error) {
        this.logger.log(error.message);
      }
      next(error)
    }
  }

  public async register(request: Request, response: Response, next: NextFunction) {
    try {
 
    } catch (error: Error | any) {
      if (error instanceof Error) {
        this.logger.log(error.message);
      }
      next(error)
    }
  }

}