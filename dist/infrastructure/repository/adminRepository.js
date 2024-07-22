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
const adminModel_1 = __importDefault(require("../database/adminModel"));
class AdminRepository {
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAdmin = new adminModel_1.default(user);
            yield newAdmin.save();
            return newAdmin;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield adminModel_1.default.findOne({ email: email });
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield adminModel_1.default.findById(id);
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    }
    updatePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield adminModel_1.default.findOneAndUpdate({ email }, { $set: { password } });
            return user;
        });
    }
}
exports.default = AdminRepository;
//# sourceMappingURL=adminRepository.js.map