"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserRequestSchema = exports.confirmEmailSchema = exports.createPasswordRequestSchema = exports.createUserRequestSchema = void 0;
const express_validation_1 = require("express-validation");
exports.createUserRequestSchema = {
    body: express_validation_1.Joi.object({
        bvn: express_validation_1.Joi.string().required().length(4),
        phone: express_validation_1.Joi.string().required(),
    }),
};
exports.createPasswordRequestSchema = {
    body: express_validation_1.Joi.object({
        password: express_validation_1.Joi.string().required(),
    }),
};
exports.confirmEmailSchema = {
    body: express_validation_1.Joi.object({
        email: express_validation_1.Joi.string().required(),
        otp: express_validation_1.Joi.string().required(),
    }),
};
exports.loginUserRequestSchema = {
    body: express_validation_1.Joi.object({
        email: express_validation_1.Joi.string().required(),
        password: express_validation_1.Joi.string().required()
    }),
};
//# sourceMappingURL=user.validator.js.map