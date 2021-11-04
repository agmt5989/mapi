"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormInput = exports.AuthMethod = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const mFormInputSchema = new mongoose_1.default.Schema({
    name: String,
    label: String,
    contentType: String,
    minLength: Number,
    maxLength: Number,
    position: Number
}, { timestamps: utils_1.timestamps });
const FormInput = mongoose_1.default.model('FormInput', mFormInputSchema);
exports.FormInput = FormInput;
const mAuthMethodSchema = new mongoose_1.default.Schema({
    type: String,
    name: String,
    ui: {
        title: String,
        form: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: FormInput
            }
        ]
    }
}, { timestamps: utils_1.timestamps });
const AuthMethod = mongoose_1.default.model('AuthMethod', mAuthMethodSchema);
exports.AuthMethod = AuthMethod;
const mInstitutionSchema = new mongoose_1.default.Schema({
    name: String,
    type: String,
    icon: String,
    identifier: String,
    primaryColor: String,
    bankCode: String,
    authMethods: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: AuthMethod
        }
    ]
}, { timestamps: utils_1.timestamps });
const Institution = mongoose_1.default.model('Institution', mInstitutionSchema);
Institution.Types = {
    BUSINESS_BANKING: 'BUSINESS_BANKING',
    PAYMENT_GATEWAY: 'PAYMENT_GATEWAY',
};
exports.default = Institution;
//# sourceMappingURL=institution.js.map