"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
class BadRequestException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.BadRequestException = BadRequestException;
//# sourceMappingURL=badRequestException.js.map