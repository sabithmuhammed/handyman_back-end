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
const userModel_1 = __importDefault(require("../database/userModel"));
class UserRepository {
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new userModel_1.default(user);
            yield newUser.save();
            return newUser;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email: email });
            return user;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findById(id);
            return user;
        });
    }
    updatePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOneAndUpdate({ email }, { $set: { password } });
            return user;
        });
    }
    toggleBlock(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findByIdAndUpdate(userId, {
                $set: { isBlocked: status },
            }, { new: true });
            return user;
        });
    }
    getAllUsers(page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = null;
            const offset = (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
            const totalCount = yield userModel_1.default.countDocuments({});
            users = yield userModel_1.default.find({}, { password: 0 })
                .skip(offset)
                .limit(pageSize ? Number(pageSize) : 10);
            return {
                users,
                totalCount,
                page: page ? Number(page) : 1,
            };
        });
    }
    updateProfile(id, name, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findByIdAndUpdate(id, {
                $set: {
                    name,
                    profile,
                },
            }, { new: true });
            return user;
        });
    }
    ChangeUserToTradesman(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findByIdAndUpdate(id, {
                $set: {
                    isTradesman: true,
                },
            }, { new: true });
            console.log(user, "checking change");
            return user;
        });
    }
}
exports.default = UserRepository;
//# sourceMappingURL=userRepository.js.map