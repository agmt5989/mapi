import { IGetStartedRequest, ILoginRequest, ILoginResponse } from '../../typing/IUser';
import { ICustomer } from '../../models/customers';
export declare class UserService {
    private readonly logger;
    constructor();
    login(requestBody: ILoginRequest): Promise<ILoginResponse>;
    getStarted(requestBody: IGetStartedRequest): Promise<ICustomer | null>;
    confirmEmail(otp: string, email: string): Promise<boolean>;
    createPassword(password: string, email: string): Promise<boolean>;
    private formatNewPortalUserFromCustomerData;
    private sendVerifcationCode;
}
