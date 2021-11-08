import * as mongoose from "mongoose";
import { timestamps } from "../utils";

export enum BusinessStatus {
  disabled = "business_disabled",
  blocked = "business_blocked",
  active = "active",
  pending = "pending",
  inactive = "inactive",
  rejected = "rejected",
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
      features: Array<{ name: string; enabled: boolean; hasWaitlist: boolean }>;
      meta: any;
    };
    percept: {
      enabled: boolean;
      hasWaitlist: boolean;
      visible: boolean;
      features: Array<{ name: string; enabled: boolean; hasWaitlist: boolean }>;
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
    active: "active";
    inactive: "inactive";
    pending: "pending";
    rejected: "rejected";
  };
  AccountTypes: {
    DEVELOPER: "developer";
    COMPANY: "company";
  };
}

const settlementAccountSchema = new mongoose.Schema({
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
  },
  accountNumber: String,
  accountName: String,
  currency: String,
  verified: { type: Boolean, default: false },
  primary: { type: Boolean, default: false },
});

const businessSchema = new mongoose.Schema(
  {
    logo: String,
    id: {
      type: Number,
      index: true,
    },
    bankAccounts: [settlementAccountSchema],
    email: String,
    phone: String,
    address: String,
    accountType: {
      type: String,
      index: true,
    },
    state: String,
    name: {
      type: String,
      required: true,
    },
    calls: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(BusinessStatus),
      default: "inactive",
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCountry",
      index: true,
    },
    subscription: {
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        index: true,
      },
      addons: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubscriptionAddon",
          index: true,
        },
      ],
    },
    enabledProducts: {
      type: {
        connect: {
          enabled: { type: Boolean, default: true },
          visible: { type: Boolean, default: true },
          features: [
            {
              name: { type: String, default: "payments" },
              enabled: { type: Boolean, default: false },
            },
          ],
          meta: mongoose.Schema.Types.Mixed,
        },
        percept: {
          enabled: { type: Boolean, default: false },
          visible: { type: Boolean, default: false },
          features: [],
          meta: {
            spaces: { type: Number, default: 0 },
            plan: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "ProductPlan",
            },
          },
        },
      },
      default: {
        connect: {
          enabled: true,
          visible: true,
          hasWaitlist: false,
          features: [
            {
              // transfer === directpay === payments
              name: "payments",
              enabled: false,
              hasWaitlist: true,
            },
          ],
          meta: {},
        },
        percept: {
          enabled: false,
          hasWaitlist: false,
          visible: false,
          features: [],
          meta: {
            spaces: 0,
            plan: "",
          },
        },
      },
    },
    useCase: {
      industry: String,
      description: String,
    },
  },
  { timestamps }
);

const Business = mongoose.model("Business", businessSchema) as IBusinessModel;

Business.Statuses = {
  active: "active",
  pending: "pending",
  inactive: "inactive",
  rejected: "rejected",
};

Business.AccountTypes = {
  DEVELOPER: "developer",
  COMPANY: "company",
};

export default Business;
