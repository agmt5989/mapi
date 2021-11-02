import mongoose from 'mongoose';
import { timestamps } from '../utils';
import { IApp } from './apps/apps';
import { IAccount } from './account';
import { IBusiness } from './business';
import { boolean } from 'joi';

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

const mCustomerSchema = new mongoose.Schema(
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
    estimatedIncome: {
      type: Number,
      default: 0,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
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
    canAccessPortal: {
      type: Boolean,
      default: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    app: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'App',
      index: true,
    },
    identity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Identity',
      index: true,
    },
  },
  { timestamps },
);

const Customer = mongoose.model<ICustomer>('Customer', mCustomerSchema);

export default Customer;
