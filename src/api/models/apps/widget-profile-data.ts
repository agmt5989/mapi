import mongoose from 'mongoose';

export interface IWidgetProfileData extends mongoose.Document {
  widgetTypes: Array<{ text: string; value: string }>;
  consentPage: {
    introductionMessage: string;
    widgetIcons: Array<string>;
    button: Array<string>;
  };
  institutionSelect: {
    title: string;
    bankLists: Array<string>;
  };
  institutionSearch: {
    searchMessage: string;
    text: string;
    link: Array<string>;
  };
  login: {
    cta: Array<string>;
  };
  connected: {
    title: string;
    followText: string;
    cta: Array<string>;
  };
}

const widgetProfileDataSchema = new mongoose.Schema(
  {
    widgetTypes: Array,
    consentPage: {
      introductionMessage: String,
      widgetIcons: Array,
      button: [String],
    },
    institutionSelect: {
      title: String,
    },
    institutionSearch: {
      searchMessage: String,
      text: String,
      link: [String],
    },
    login: {
      cta: [String],
    },
    connected: {
      title: String,
      followText: String,
      cta: [String],
    },
  },
  {
    collection: 'widgetprofiledata',
  },
);

const WidgetProfileData = mongoose.model<IWidgetProfileData>(
  'WidgetProfileData',
  widgetProfileDataSchema,
);

export default WidgetProfileData;
