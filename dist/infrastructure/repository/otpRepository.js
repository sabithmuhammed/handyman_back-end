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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otpModel_1 = __importDefault(require("../database/otpModel"));
class OtpRepository {
    storeOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otpModel_1.default.findOneAndUpdate({ email }, { $set: { otp } }, { upsert: true });
        });
    }
    retrieveOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpData = yield otpModel_1.default.findOne({ email });
            if (otpData) {
                return otpData.otp;
            }
            else {
                return null;
            }
        });
    }
    clearOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otpModel_1.default.findOneAndDelete({ email });
        });
    }
}
exports.default = OtpRepository;
//# sourceMappingURL=otpRepository.js.map