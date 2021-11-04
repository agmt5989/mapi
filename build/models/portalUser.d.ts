import mongoose from 'mongoose';
import { ICustomer } from './customers';
export interface IPortalUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    name: string;
    scope: Array<string>;
    email: string;
    phone: string;
    bvn: string;
    password?: string;
    emailOTP: string;
    emailVerified: boolean;
    customer: ICustomer;
}
declare const Customer: mongoose.Model<IPortalUser, {}, {}, {}>;
export default Customer;
