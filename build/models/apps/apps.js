"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDataSyncInterval = exports.MonoProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../utils/index");
var MonoProducts;
(function (MonoProducts) {
    MonoProducts["CONNECT"] = "CONNECT";
    MonoProducts["DIRECT_DEBIT"] = "TRANSFER_PAY";
    MonoProducts["PERCEPT"] = "PERCEPT";
    MonoProducts["MY_PASS"] = "MY_PASS";
})(MonoProducts = exports.MonoProducts || (exports.MonoProducts = {}));
var CustomDataSyncInterval;
(function (CustomDataSyncInterval) {
    CustomDataSyncInterval["daily"] = "DAILY";
    CustomDataSyncInterval["weekly"] = "WEEKLY";
    CustomDataSyncInterval["monthly"] = "MONTHLY";
    CustomDataSyncInterval["yearly"] = "YEARLY";
})(CustomDataSyncInterval = exports.CustomDataSyncInterval || (exports.CustomDataSyncInterval = {}));
const LinkAccountTypes = {
    ALL: 'all',
    PERSONAL: 'personal',
    BUSINESS: 'business',
};
const mAppSchema = new mongoose_1.default.Schema({
    name: String,
    icon: {
        type: String,
        default: '',
    },
    business: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: index_1.timestamps });
const App = mongoose_1.default.model('App', mAppSchema);
// @ts-ignore
App.LinkAccountTypes = LinkAccountTypes;
exports.default = App;
//# sourceMappingURL=apps.js.map