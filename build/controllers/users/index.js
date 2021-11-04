"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validation_1 = require("express-validation");
const user_validator_1 = require("./user.validator");
const user_controller_1 = require("./user.controller");
const userRoutes = express_1.default.Router();
const controller = new user_controller_1.UserController();
userRoutes.post('/login', (0, express_validation_1.validate)(user_validator_1.createUserRequestSchema), controller.login);
userRoutes.post('/get-started', (0, express_validation_1.validate)(user_validator_1.loginUserRequestSchema), controller.getStarted);
userRoutes.post('/confirm-email', (0, express_validation_1.validate)(user_validator_1.confirmEmailSchema), controller.confirmEmail);
userRoutes.post('/create-password/:email', (0, express_validation_1.validate)(user_validator_1.createPasswordRequestSchema), controller.createPassword);
exports.default = userRoutes;
//# sourceMappingURL=index.js.map