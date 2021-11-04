"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailing = void 0;
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const mailgun = new mailgun_js_1.default({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});
class Mailing {
    constructor() {
        this.mailgun = mailgun;
    }
    send(data) {
        let { templateVariables, ...rest } = data;
        if (templateVariables) {
            templateVariables = JSON.stringify(templateVariables);
        }
        return this.mailgun.messages().send({
            ...rest,
            "h:X-Mailgun-Variables": templateVariables ?? undefined,
        });
    }
}
exports.Mailing = Mailing;
exports.default = mailgun;
//# sourceMappingURL=mailing.js.map