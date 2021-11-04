import mongoose from 'mongoose';
import { IBusiness } from '../business';
export declare enum MonoProducts {
    CONNECT = "CONNECT",
    DIRECT_DEBIT = "TRANSFER_PAY",
    PERCEPT = "PERCEPT",
    MY_PASS = "MY_PASS"
}
export declare enum CustomDataSyncInterval {
    daily = "DAILY",
    weekly = "WEEKLY",
    monthly = "MONTHLY",
    yearly = "YEARLY"
}
export interface IApp extends mongoose.Document {
    name: string;
    icon: string;
    business: IBusiness['_id'];
    displayName: string;
    redirectUri: string;
    live: boolean;
    testPubKey: string;
    testSecKey: string;
    livePubKey: string;
    liveSecKey: string;
    linkAccountType: Array<string>;
    industry: Array<string>;
    scopes: Array<string>;
    product: MonoProducts;
}
declare type appStaticProps = {
    LinkAccountTypes: {
        ALL: 'all';
        PERSONAL: 'personal';
        BUSINESS: 'business';
    };
};
declare const App: mongoose.Model<IApp, {}, {}, {}> & appStaticProps;
export default App;
