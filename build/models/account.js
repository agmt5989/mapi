"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const mAccountSchema = new mongoose_1.default.Schema({
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
        enum: ['AVAILABLE', 'PROCESSING', 'FAILED'],
        default: 'AVAILABLE',
        index: true,
    },
    linked: {
        type: Boolean,
        default: false,
        index: true,
    },
    customer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Customer',
        index: true,
    },
    app: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'App',
        index: true,
    },
    business: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'business',
        index: true,
    },
    institution: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Institution',
        index: true,
    },
}, { timestamps: utils_1.timestamps });
mAccountSchema.pre('aggregate', function (next) {
    // attach match  on fly
    this.append({ $match: { live: { $ne: false } } });
    next(null);
});
mAccountSchema.pre('find', function (next) {
    // attach query on fly
    this.where({ live: { $ne: false } });
    next(null);
});
mAccountSchema.pre('findOne', function (next) {
    // attach query on fly
    this.where({ live: { $ne: false } });
    next(null);
});
mAccountSchema.pre('count', function (next) {
    // attach query on fly
    this.where({ live: { $ne: false } });
    next(null);
});
const Account = mongoose_1.default.model('Account', mAccountSchema);
exports.default = Account;
//# sourceMappingURL=account.js.map