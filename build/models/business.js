"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessStatus = void 0;
const mongoose = __importStar(require("mongoose"));
const utils_1 = require("../utils");
var BusinessStatus;
(function (BusinessStatus) {
    BusinessStatus["disabled"] = "business_disabled";
    BusinessStatus["blocked"] = "business_blocked";
    BusinessStatus["active"] = "active";
    BusinessStatus["pending"] = "pending";
    BusinessStatus["inactive"] = "inactive";
    BusinessStatus["rejected"] = "rejected";
})(BusinessStatus = exports.BusinessStatus || (exports.BusinessStatus = {}));
const settlementAccountSchema = new mongoose.Schema({
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
    },
    accountNumber: String,
    accountName: String,
    currency: String,
    verified: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
});
const businessSchema = new mongoose.Schema({
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
        default: 'inactive',
        index: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCountry',
        index: true,
    },
    subscription: {
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubscriptionPlan',
            index: true,
        },
        addons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SubscriptionAddon',
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
                        name: { type: String, default: 'payments' },
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
                        ref: 'ProductPlan',
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
                        name: 'payments',
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
                    plan: '',
                },
            },
        },
    },
    useCase: {
        industry: String,
        description: String,
    },
}, { timestamps: utils_1.timestamps });
const Business = mongoose.model('Business', businessSchema);
Business.Statuses = {
    active: 'active',
    pending: 'pending',
    inactive: 'inactive',
    rejected: 'rejected',
};
Business.AccountTypes = {
    DEVELOPER: 'developer',
    COMPANY: 'company',
};
exports.default = Business;
//# sourceMappingURL=business.js.map