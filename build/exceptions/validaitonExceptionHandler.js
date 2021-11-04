"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorWrapper = void 0;
const ApiStatusCodes_1 = __importDefault(require("../utils/ApiStatusCodes"));
const express_validation_1 = require("express-validation");
function validationErrorWrapper(err, req, res, next) {
    if (err instanceof express_validation_1.ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(ApiStatusCodes_1.default.serverError).json(err);
}
exports.validationErrorWrapper = validationErrorWrapper;
//# sourceMappingURL=validaitonExceptionHandler.js.map