"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiStatusCodes_1 = __importDefault(require("./ApiStatusCodes"));
class ApiResponse {
    static success(res, status, data, message) {
        return res.status(status).json({
            status,
            message,
            data,
        });
    }
    static send(res, status, message, data = null) {
        res.status(status).send({
            status,
            message,
            data,
        });
    }
    static error(res, code, error = {}, message) {
        if (code === parseInt('444')) {
            return this.send(res, ApiStatusCodes_1.default.badRequest, error.message);
        }
        return this.send(res, code, message, error);
    }
}
exports.default = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map