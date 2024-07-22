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
const httpStatusCodes_1 = require("../infrastructure/constants/httpStatusCodes");
const roles_1 = __importDefault(require("../infrastructure/constants/roles"));
class AdminUsecase {
    constructor(adminRepository, encrypt, jwtCreate) {
        this.adminRepository = adminRepository;
        this.encrypt = encrypt;
        this.jwtCreate = jwtCreate;
    }
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.adminRepository.findByEmail(email);
            if (userFound) {
                const passMatch = yield this.encrypt.compare(password, userFound.password);
                if (passMatch) {
                    const accessToken = this.jwtCreate.generateAccessToken(userFound._id, roles_1.default.ADMIN);
                    const refreshToken = this.jwtCreate.generateRefreshToken(userFound._id, roles_1.default.ADMIN);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        data: {
                            userData: {
                                name: userFound.name,
                                email: userFound.email,
                            },
                            accessToken,
                            isAdmin: true
                        },
                        refreshToken,
                    };
                }
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                data: "Incorrect email or password",
            };
        });
    }
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.adminRepository.findByEmail(email);
            return {
                status: httpStatusCodes_1.STATUS_CODES.CONFLICT,
                data: userFound,
            };
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUpdate = yield this.adminRepository.updatePassword(email, password);
            if (!userUpdate) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.NOT_FOUND,
                    data: "No account found",
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: userUpdate,
            };
        });
    }
}
exports.default = AdminUsecase;
//# sourceMappingURL=adminUsecase.js.map