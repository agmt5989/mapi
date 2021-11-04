"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const user_service_1 = require("./user.service");
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const ApiStatusCodes_1 = __importDefault(require("../../utils/ApiStatusCodes"));
const utils_1 = require("../../utils");
class UserController {
    constructor() {
        this.logger = new logger_1.default('mono-portal:controllers/user/user.controller');
        this.login = async (request, response, next) => {
            try {
                const result = await this.userService.login(request.body);
                if (result.error)
                    return ApiResponse_1.default.error(response, ApiStatusCodes_1.default.badRequest, result.data, result.message);
                const responseData = { customer: result.data, token: result.data ? (0, utils_1.generateJWT)(result.data) : null };
                ApiResponse_1.default.success(response, ApiStatusCodes_1.default.success, responseData, result.message);
            }
            catch (error) {
                this.logger.log(error);
                next(error);
            }
        };
        this.getStarted = async (request, response, next) => {
            try {
                const customer = await this.userService.getStarted(request.body);
                if (!customer)
                    return ApiResponse_1.default.error(response, ApiStatusCodes_1.default.notFound, null, 'Invalid credential, already used or does not match an Mono account');
                ApiResponse_1.default.success(response, ApiStatusCodes_1.default.success, customer, `Email Verification Code sent to ${customer.email}`);
            }
            catch (error) {
                this.logger.log(error.message);
                next(error);
            }
        };
        this.confirmEmail = async (request, response, next) => {
            try {
                const { email, otp } = request.body;
                const isVerified = await this.userService.confirmEmail(otp, email);
                if (!isVerified)
                    return ApiResponse_1.default.error(response, ApiStatusCodes_1.default.badRequest, null, 'Invalid Email Verification Code');
                ApiResponse_1.default.success(response, ApiStatusCodes_1.default.success, null, `${email} has been successfully verified to access Mono Portal`);
            }
            catch (error) {
                this.logger.log(error.message);
                next(error);
            }
        };
        this.createPassword = async (request, response, next) => {
            try {
                const { password, confirmPassword } = request.body;
                if (password > 8)
                    return ApiResponse_1.default.error(response, ApiStatusCodes_1.default.badRequest, null, 'Passwords must be greater than 8 characters');
                const result = await this.userService.createPassword(password, request.params.email);
                if (!result)
                    return ApiResponse_1.default.error(response, ApiStatusCodes_1.default.badRequest, null, `Could not choose password successfully for ${request.params.email}, please ensure the email is verified`);
                ApiResponse_1.default.success(response, ApiStatusCodes_1.default.success, null, `Successfully set password for ${request.params.email}`);
            }
            catch (error) {
                this.logger.log(error.message);
                next(error);
            }
        };
        // TODO
        this.resendVerficationLink = async (request, response, next) => {
        };
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map