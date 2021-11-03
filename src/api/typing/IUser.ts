import { ICustomer } from "../models/customers";

export interface IGetStartedRequest {
 phone: string,
 bvn: string,
}

export interface ILoginRequest {
  email: string,
  password: string,
 }

export interface ILoginResponse { error: boolean; data?: ICustomer; message: string; }
