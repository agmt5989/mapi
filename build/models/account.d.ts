import mongoose from 'mongoose';
import { IApp } from './apps/apps';
import { IInstitution } from './institution';
import { IBusiness } from './business';
export interface IAccount extends mongoose.Document {
    name: string;
    accountNumber: string;
    currency: string;
    balance: number;
    estimatedIncome: number;
    linked: boolean;
    type: string;
    bvn: string;
    status: 'AVAILABLE' | 'PROCESSING' | 'FAILED';
    meta: Record<string, any>;
    app: IApp;
    business: IBusiness;
    institution: IInstitution;
    updated_at: Date;
    created_at: Date;
    customer: any;
    live: boolean;
}
declare const Account: mongoose.Model<IAccount, {}, {}, {}>;
export default Account;
