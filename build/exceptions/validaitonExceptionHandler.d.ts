import { Request, Response, NextFunction } from 'express';
export declare function validationErrorWrapper(err: any, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
