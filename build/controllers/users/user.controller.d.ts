import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    private readonly logger;
    private userService;
    constructor();
    login: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    getStarted: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    confirmEmail: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    createPassword: (request: Request, response: Response, next: NextFunction) => Promise<void>;
    resendVerficationLink: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}
