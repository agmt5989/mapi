"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const mPortalUserSchema = new mongoose_1.default.Schema({
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
    password: {
        type: String,
    },
    emailOTP: String,
    emailVerified: {
        type: Boolean,
        default: false
    },
    customer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Customer',
        index: true,
    }
}, { timestamps: utils_1.timestamps });
const Customer = mongoose_1.default.model('PortaUser', mPortalUserSchema);
exports.default = Customer;
//# sourceMappingURL=portalUser.js.map