import mongoose, { Aggregate } from "mongoose";

import { timestamps } from "../utils";
import { IApp } from "./apps/apps";
import { IInstitution } from "./institution";
import { IBusiness } from "./business";

export interface IAccount extends mongoose.Document {
  name: string;
  accountNumber: string;
  currency: string;
  balance: number;
  estimatedIncome: number;
  linked: boolean;
  type: string;
  bvn: string;
  status: "AVAILABLE" | "PROCESSING" | "FAILED";
  meta: Record<string, any>;
  app: IApp;
  business: IBusiness;
  institution: IInstitution;
  updated_at: Date;
  created_at: Date;
  customer: any;
  live: boolean;
}

const mAccountSchema = new mongoose.Schema(
  {
    name: String,
    accountNumber: String,
    currency: String,
    balance: Number,
    type: String,
    bvn: String,
    live: { type: Boolean, index: true },
    estimatedIncome: {
      type: Number,
      default: 0,
    },
    meta: Object,
    status: {
      type: String,
      enum: ["AVAILABLE", "PROCESSING", "FAILED"],
      default: "AVAILABLE",
      index: true,
    },
    linked: {
      type: Boolean,
      default: false,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      index: true,
    },
    app: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "App",
      index: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
      index: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      index: true,
    },
  },
  { timestamps }
);

mAccountSchema.pre("aggregate", function (this: Aggregate<IAccount>, next) {
  // attach match  on fly

  this.append({ $match: { live: { $ne: false } } });

  next(null);
});

mAccountSchema.pre("find", function (next) {
  // attach query on fly
  this.where({ live: { $ne: false } });
  next(null);
});

mAccountSchema.pre("findOne", function (next) {
  // attach query on fly

  this.where({ live: { $ne: false } });
  next(null);
});

mAccountSchema.pre("count", function (next) {
  // attach query on fly

  this.where({ live: { $ne: false } });
  next(null);
});
const Account = mongoose.model<IAccount>("Account", mAccountSchema);

export default Account;
