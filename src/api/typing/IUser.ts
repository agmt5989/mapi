import { IPortalUser } from "api/models/portalUser";

export interface IGetStartedRequest {
 phone: string,
 bvn: string,
}

export interface ILoginRequest {
  email: string,
  password: string,
 }

export interface ILoginResponse { error: boolean; data?: IPortalUser; message: string; }
