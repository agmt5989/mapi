import { IPortalUser } from "api/models/portalUser";
import { ICustomer } from "../models/customers";

export interface IGetStartedRequest {
 phone: string,
 bvn: string,
}

export interface ILoginRequest {
  email: string,
  password: string,
}

export type TTokenPayload = {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  bvn: string,
  app: string
}

export interface ILoginResponse { error: boolean; data?: IPortalUser; message: string; }
