import mongoose from 'mongoose';
import { timestamps } from '../utils';
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

const mPortalUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: String,
    scope: {
      type: [String],
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    bvn: {
      type: String,
      index: true,
    },
    password: {
      type: String,
    },
    emailOTP: String,
    emailVerified: {
      type: Boolean,
      default: false
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      index: true,
    }
  },
  { timestamps },
);

const Customer = mongoose.model<IPortalUser>('PortaUser', mPortalUserSchema);

export default Customer;
