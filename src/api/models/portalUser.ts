import mongoose from 'mongoose';
import { timestamps } from '../utils';

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
  canAccessPortal: boolean;
  emailVerified: boolean;
  identity?: any;
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
    canAccessPortal: {
      type: Boolean,
      default: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    identity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Identity',
      index: true,
    },
  },
  { timestamps },
);

const Customer = mongoose.model<IPortalUser>('PortaUser', mPortalUserSchema);

export default Customer;
