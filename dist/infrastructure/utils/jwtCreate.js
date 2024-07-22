"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants/constants");
class JwtCreate {
    generateAccessToken(userId, role) {
        const KEY = process.env.JWT_KEY;
        if (KEY) {
            const exp = Math.floor(Date.now() / 1000) + constants_1.ACCESS_TOKEN_MAX_AGE;
            return jsonwebtoken_1.default.sign({ userId, role, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error("JWT key is not defined");
    }
    generateRefreshToken(userId, role) {
        const KEY = process.env.JWT_KEY;
        if (KEY) {
            const exp = Math.floor(Date.now() / 1000) + constants_1.REFRESH_TOKEN_MAX_AGE;
            return jsonwebtoken_1.default.sign({ userId, role, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error("JWT key is not defined");
    }
    createTokenIfRefreshTokenIsValid(token) {
        try {
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            const accessToken = this.generateAccessToken(decode.userId, decode.role);
            return accessToken;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = JwtCreate;
//# sourceMappingURL=jwtCreate.js.map