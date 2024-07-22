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
const constants_1 = require("../infrastructure/constants/constants");
class OtpUsecase {
    constructor(otpRepository, encrypt) {
        this.otpRepository = otpRepository;
        this.encrypt = encrypt;
    }
    saveOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, otp }) {
            try {
                const hashedOtp = yield this.encrypt.createHash(otp);
                yield this.otpRepository.storeOtp(email, hashedOtp);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.otpRepository.clearOtp(email);
                }), constants_1.OTP_TIMER);
                return {
                    status: "success",
                };
            }
            catch (error) {
                return {
                    status: "failed",
                    error,
                };
            }
        });
    }
    compareOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, otp }) {
            try {
                const hashedOtp = yield this.otpRepository.retrieveOtp(email);
                const compare = yield this.encrypt.compare(otp, hashedOtp);
                return {
                    status: "success",
                    data: compare,
                };
            }
            catch (error) {
                return {
                    status: "failed",
                    error,
                };
            }
        });
    }
    removeOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.otpRepository.clearOtp(email);
                return {
                    status: "success",
                };
            }
            catch (error) {
                return {
                    status: "failed",
                    error,
                };
            }
        });
    }
}
exports.default = OtpUsecase;
//# sourceMappingURL=otpUsecase.js.map