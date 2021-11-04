"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../../utils/logger"));
const customers_1 = __importDefault(require("../../models/customers"));
const portalUser_1 = __importDefault(require("../../models/portalUser"));
const utils_1 = require("../../utils");
const mailing_1 = require("../../contrib/mailing");
const cache_1 = __importDefault(require("../../contrib/cache"));
class UserService {
    constructor() {
        this.logger = new logger_1.default('mono-portal:controllers/user/user.service');
    }
    async login(requestBody) {
        let user;
        try {
            user = await portalUser_1.default.findOne({ email: requestBody.email }).populate({
                path: 'businesses',
                select: '_id firstName lastName name email name phone bvn password customer',
            })
                .lean();
        }
        catch (error) {
            return { error: true, message: error instanceof Error ? error.message : 'An Error Occured' };
        }
        if (!user)
            return { error: true, message: 'Invalid email or password' };
        const passwordIsValid = bcrypt_1.default.compareSync(requestBody.password, user.password);
        user.password = undefined; // unset password hash from response data;
        return passwordIsValid
            ? {
                error: false,
                message: 'Login Successful',
                data: user
            } : {
            error: true,
            message: 'Invalid email or password',
        };
    }
    async getStarted(requestBody) {
        const { phone, bvn } = requestBody;
        // last four digits for bvn
        const customer = await customers_1.default.findOne({ bvn: { $regex: `${bvn}$` }, phone });
        if (!customer)
            return null;
        const id = `getstarted-otp-${phone}`;
        let session = await cache_1.default.getAsync(id);
        if (session)
            return null;
        const emailOTP = (0, utils_1.generateRandomString)(6, 'numbers');
        if (!session) {
            const new_session = {
                count: 1,
                emailOTP,
                expiresAt: new Date().getTime() + 1 * 60 * 60 * 1000,
            };
            cache_1.default.set(id, JSON.stringify(new_session));
            cache_1.default.expire(id, 3600); // expires in 1hr
        }
        const portalUser = this.formatNewPortalUserFromCustomerData(emailOTP, customer);
        const newPortalUser = new portalUser_1.default(portalUser);
        await newPortalUser.save();
        this.sendVerifcationCode(emailOTP, portalUser.email, portalUser.firstName);
        return customer;
    }
    async confirmEmail(otp, email) {
        const customer = await portalUser_1.default.findOneAndUpdate({ emailOTP: otp, email }, {
            emailVerified: true,
            $unset: {
                emailOTP: 1,
            },
        });
        if (!customer)
            return false;
        // confirm what todo when account is confirmed (send email probably)
        return true;
    }
    async createPassword(password, email) {
        const passwordHash = bcrypt_1.default.hashSync(password, 10);
        const customer = await customers_1.default.findOneAndUpdate({
            emailVerified: true,
            email
        }, {
            password: passwordHash,
        });
        if (!customer)
            return false;
        return true;
    }
    formatNewPortalUserFromCustomerData(emailOTP, customer) {
        return {
            firstName: customer.firstName,
            lastName: customer.lastName,
            name: customer.name,
            customer: customer.id,
            scope: customer.scope,
            email: customer.email,
            phone: customer.phone,
            bvn: customer.bvn,
            emailOTP,
            emailVerified: false,
        };
    }
    async sendVerifcationCode(code, email, firstName) {
        // TODO: Confirm mailing template for OTP
        await new mailing_1.Mailing()
            .send({
            from: `Mono <hi@mono.co>`,
            to: email,
            subject: `Please verify your email`,
            text: 'Confirm your email to continue with Mono Portal',
            template: 'confirm_account',
            templateVariables: {
                firstName,
                email,
                code
            },
        })
            .catch(e => {
            this.logger.log(e);
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map