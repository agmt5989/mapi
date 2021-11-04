import mongoose from 'mongoose';
export interface IInstitution extends mongoose.Document {
    name: string;
    bankCode: string;
    type: string;
    icon: string;
    identifier: string;
    primaryColor: string;
    authMethod: any[];
}
declare type institutionStaticProps = {
    Types: {
        BUSINESS_BANKING: string;
        PAYMENT_GATEWAY: string;
    };
};
declare const FormInput: mongoose.Model<any, {}, {}, {}>;
declare const AuthMethod: mongoose.Model<any, {}, {}, {}>;
declare const Institution: mongoose.Model<IInstitution, {}, {}, {}> & institutionStaticProps;
export { AuthMethod, FormInput };
export default Institution;
