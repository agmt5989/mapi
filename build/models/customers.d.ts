import mongoose from 'mongoose';
import { IApp } from './apps/apps';
import { IBusiness } from './business';
export interface ICustomer extends mongoose.Document {
    firstName: string;
    lastName: string;
    name: string;
    scope: Array<string>;
    email: string;
    phone: string;
    business: IBusiness;
    estimatedIncome: number;
    bvn: string;
    app: IApp;
    identity: any;
}
declare const Customer: mongoose.Model<ICustomer, {}, {}, {}>;
export default Customer;
