import { Response } from 'express';
export default class ApiResponse {
    static success(res: Response, status: number, data: any, message: string): Response<any, Record<string, any>>;
    static send(res: Response, status: number, message: string, data?: any): void;
    static error(res: Response, code: number, error: any, message: string): void;
}
