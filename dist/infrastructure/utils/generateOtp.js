"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants/constants");
class GenerateOtp {
    generateOtp(length) {
        return __awaiter(this, void 0, void 0, function* () {
            const numericCharecters = constants_1.OTP_STRING;
            let otp = "";
            for (let i = 0; i < length; i++) {
                const randIndex = Math.floor(Math.random() * numericCharecters.length);
                otp += numericCharecters[randIndex];
            }
            return otp;
        });
    }
}
exports.default = GenerateOtp;
//# sourceMappingURL=generateOtp.js.map