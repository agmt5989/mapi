"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = exports.generateJWT = exports.timestamps = exports.sleep = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function sleep(ms) {
    return new Promise((resolve) => {
        return setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
exports.timestamps = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
};
const generateJWT = (user) => {
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        bvn: user.bvn,
        customer: user.customer
    }, process.env.JWT_SECRET || 'A5KPb64mdHfad1J5', { expiresIn: '24h' });
    return token;
};
exports.generateJWT = generateJWT;
function generateRandomString(length = 13, type) {
    const chars = type === 'numbers' ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const rands = [];
    let i = -1;
    while (++i < length) {
        // @ts-ignore
        rands.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }
    return rands.join('');
}
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=index.js.map