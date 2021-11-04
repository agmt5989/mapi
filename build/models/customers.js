"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const mCustomerSchema = new mongoose_1.default.Schema({
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
    estimatedIncome: {
        type: Number,
        default: 0,
    },
    business: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Business',
        index: true,
    },
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
    app: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'App',
        index: true,
    },
    identity: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Identity',
        index: true,
    },
}, { timestamps: utils_1.timestamps });
const Customer = mongoose_1.default.model('Customer', mCustomerSchema);
exports.default = Customer;
//# sourceMappingURL=customers.js.map