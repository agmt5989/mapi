"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiStatusCodes_1 = __importDefault(require("../utils/ApiStatusCodes"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const validaitonExceptionHandler_1 = require("../exceptions/validaitonExceptionHandler");
const users_1 = __importDefault(require("../controllers/users"));
const indexRoutes = express_1.default.Router();
indexRoutes.use('/users', users_1.default);
indexRoutes.use(validaitonExceptionHandler_1.validationErrorWrapper);
indexRoutes.get('/', (req, res) => {
    return ApiResponse_1.default.send(res, ApiStatusCodes_1.default.success, 'This app is running.');
});
indexRoutes.get('*', (req, res) => {
    return ApiResponse_1.default.send(res, ApiStatusCodes_1.default.notFound, 'Endpoint not found.');
});
exports.default = indexRoutes;
//# sourceMappingURL=index.js.map