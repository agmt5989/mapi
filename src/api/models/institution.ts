import mongoose from 'mongoose';

import { timestamps } from '../utils';

export interface IInstitution extends mongoose.Document {
  name: string;
  bankCode: string;
  type: string;
  icon: string;
  identifier: string;
  primaryColor: string;
  authMethod: any[];
}

type institutionStaticProps = {
  Types: {
    BUSINESS_BANKING: string;
    PAYMENT_GATEWAY: string;
  };
};

const mFormInputSchema =  new mongoose.Schema(
  {
    name: String,
    label: String,
    contentType: String,
    minLength: Number,
    maxLength: Number,
    position: Number
  },
  { timestamps }
);

const FormInput = mongoose.model('FormInput', mFormInputSchema);

const mAuthMethodSchema = new mongoose.Schema(
  {
    type: String,
    name: String,
    ui: {
      title: String,
      form: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: FormInput
        }
      ]
    }
  },
  { timestamps }
);

const AuthMethod = mongoose.model('AuthMethod', mAuthMethodSchema);

const mInstitutionSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    icon: String,
    identifier: String,
    primaryColor: String,
    bankCode: String,
    authMethods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: AuthMethod
      }
    ]
  },
  { timestamps },
);

const Institution = mongoose.model(
  'Institution',
  mInstitutionSchema,
) as mongoose.Model<IInstitution> & institutionStaticProps;
Institution.Types = {
  BUSINESS_BANKING: 'BUSINESS_BANKING',
  PAYMENT_GATEWAY: 'PAYMENT_GATEWAY',
};

export {
   AuthMethod,
   FormInput
}

export default Institution;
