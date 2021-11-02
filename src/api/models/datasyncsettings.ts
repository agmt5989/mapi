import mongoose from 'mongoose';

import { timestamps } from '../utils';
import { IBusiness } from './business';

import { IApp } from './apps/apps';

export enum CustomDataSyncInterval {
  daily = 'DAILY',
  weekly = 'WEEKLY',
  monthly = 'MONTHLY',
  yearly = 'YEARLY',
}

// todo link relationship to widgetProfile
export interface IDataSyncSettings extends mongoose.Document {
  business: IBusiness;
  app: IApp;

  isCustomMode: boolean;
  interval: CustomDataSyncInterval;
  duration: number;
  time: string;
  startDate: string;
}

const mDataSyncSettingSchema = new mongoose.Schema(
  {
    isCustomMode: { type: Boolean, default: false },
    interval: {
      type: String,
      default: CustomDataSyncInterval.daily,
      enum: Object.values(CustomDataSyncInterval),
    },
    duration: { type: Number, default: 1 },
    time: { type: String },
    startDate: { type: String },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
    app: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'App',
      unique: 1,
      index: true,
    },
  },
  { timestamps },
);

const DataSyncSettings = mongoose.model<IDataSyncSettings>(
  'DataSyncSettings',
  mDataSyncSettingSchema,
);

export default DataSyncSettings;
