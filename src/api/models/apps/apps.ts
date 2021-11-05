import mongoose from 'mongoose';

import { timestamps } from '../../utils/index';
import { IBusiness } from '../business';

export enum MonoProducts {
  CONNECT = 'CONNECT',
  DIRECT_DEBIT = 'TRANSFER_PAY',
  PERCEPT = 'PERCEPT',
  MY_PASS = 'MY_PASS',
}

export enum CustomDataSyncInterval {
  daily = 'DAILY',
  weekly = 'WEEKLY',
  monthly = 'MONTHLY',
  yearly = 'YEARLY',
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

type appStaticProps = {
  LinkAccountTypes: {
    ALL: 'all';
    PERSONAL: 'personal';
    BUSINESS: 'business';
  };
};

const LinkAccountTypes = {
  ALL: 'all',
  PERSONAL: 'personal',
  BUSINESS: 'business',
};

const mAppSchema = new mongoose.Schema(
  {
    name: String,
    icon: {
      type: String,
      default: '',
    },

    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
    displayName: String,
    redirectUri: String,
    live: {
      type: Boolean,
      default: false,
      index: true,
    },
    linkAccountType: {
      type: String,
      enum: ['personal', 'business', 'all'],
      index: true,
    },
    scopes: {
      type: [String],
      index: true,
    },
    industry: {
      type: [String],
      index: true,
    },
    product: {
      type: String,
      required: true,
      enum: ['PERCEPT', 'MY_PASS', 'CONNECT'],
      default: 'CONNECT',
      index: true,
    },
  },
  { timestamps },
);

const App = mongoose.model('App', mAppSchema) as mongoose.Model<IApp> &
  appStaticProps;
// @ts-ignore
App.LinkAccountTypes = LinkAccountTypes;

export default App;
