import * as mongoose from 'mongoose';
export declare enum BusinessStatus {
    disabled = "business_disabled",
    blocked = "business_blocked",
    active = "active",
    pending = "pending",
    inactive = "inactive",
    rejected = "rejected"
}
export interface IBusiness extends mongoose.Document {
    logo: string;
    id: number;
    name: string;
    email: string;
    phone: string;
    bankAccounts: any[];
    status: string;
    address: string;
    country: any;
    state: string;
    owner: any;
    accountType: string;
    calls: number;
    enabledProducts: {
        connect: {
            enabled: boolean;
            visible: boolean;
            hasWaitlist: boolean;
            features: Array<{
                name: string;
                enabled: boolean;
                hasWaitlist: boolean;
            }>;
            meta: any;
        };
        percept: {
            enabled: boolean;
            hasWaitlist: boolean;
            visible: boolean;
            features: Array<{
                name: string;
                enabled: boolean;
                hasWaitlist: boolean;
            }>;
            meta: any;
        };
    };
    useCase: {
        industry: string;
        description: string;
    };
    subscription: {
        plan: any;
        addons: any[];
    };
}
export interface IBusinessModel extends mongoose.Model<IBusiness> {
    Statuses: {
        active: 'active';
        inactive: 'inactive';
        pending: 'pending';
        rejected: 'rejected';
    };
    AccountTypes: {
        DEVELOPER: 'developer';
        COMPANY: 'company';
    };
}
declare const Business: IBusinessModel;
export default Business;
