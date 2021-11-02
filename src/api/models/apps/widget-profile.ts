import mongoose from 'mongoose';

import { timestamps } from '../../utils';
import { IBusiness } from '../business';

export interface IWidgetProfile extends mongoose.Document {
  name: string;
  published: Date | undefined;
  type: string;
  consentPage: {
    introductionMessage: string;
    widgetIcon: string;
    pageEnabled: any;
    button: string;
    backgroundColor: string;
  };
  institutionSelect: {
    title: string;
    backgroundColor: string;
    banks: {
      id: string;
      authMethods: string;
    }[];
  };
  institutionSearch: {
    searchMessage: string;
    searchQuery: string;
    cta: boolean;
    backgroundColor: string;
    text: string;
    link: string;
  };
  login: {
    cta: string;
  };
  selectAccount: {
    multipleAccount: boolean;
  };
  connected: {
    title: string;
    followText: string;
    cta: string;
  };
  branding: {
    disabled: boolean
  };
  business: IBusiness;
}

const mWidgetProfile = new mongoose.Schema(
  {
    name: { type: String, required: true },
    published: Date,
    type: {
      type: String,
      enum: ['FINANCIAL_DATA', 'DIRECT_DEBIT'],
    },
    consentPage: {
      introductionMessage: String,
      widgetIcon: {
        type: String,
        enum: ['COMPANY_LOGO', 'APP_ICON'],
      },
      pageEnabled: mongoose.Schema.Types.Mixed,
      button: String,
      backgroundColor: String,
    },
    institutionSelect: {
      title: String,
      backgroundColor: String,
      banks: [{ 
        id: { type: String },
        authMethods: [String]
      }],
    },
    institutionSearch: {
      searchMessage: String,
      searchQuery: { type: Boolean, default: true },
      cta: { type: Boolean, default: true },
      backgroundColor: String,
      text: String,
      link: String,
    },
    login: {
      cta: String,
    },
    selectAccount: {
      multipleAccount: Boolean,
    },
    connected: {
      title: String,
      followText: String,
      cta: String,
    },
    branding: {
      disabled: { 
        type: Boolean,
        default: false
      }
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
    },
  },
  { timestamps },
);

const WidgetProfile = mongoose.model<IWidgetProfile>(
  'WidgetProfile',
  mWidgetProfile,
);

export default WidgetProfile;
