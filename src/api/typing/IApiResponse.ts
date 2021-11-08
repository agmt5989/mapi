import { Response } from "express";
import Obj from "./Obj";

export interface IApiResponse {
  expressResponse: Response;
  statusCode: number;
  data?: Obj | null;
  error?: Obj | null;
  message: string;
}
