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
class UserUsecase {
    constructor(userRepository, encrypt, jwtCreate) {
        this.userRepository = userRepository;
        this.encrypt = encrypt;
        this.jwtCreate = jwtCreate;
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.encrypt.createHash(user.password);
            user.password = hashedPassword;
            const userSave = yield this.userRepository.save(user);
            return {
                status: httpStatusCodes_1.STATUS_CODES.CREATED,
                data: {
                    name: userSave.name,
                    email: userSave.email,
                    isTradesman: userSave.isTradesman,
                },
            };
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.userRepository.findByEmail(email);
            if (userFound) {
                if (userFound.isBlocked) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.FORBIDDEN,
                        data: "You have been blocked by admin",
                    };
                }
                if (userFound.isGoogle) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.CONFLICT,
                    };
                }
                const passMatch = yield this.encrypt.compare(password, userFound.password);
                if (passMatch) {
                    const accessToken = this.jwtCreate.generateAccessToken(userFound._id, roles_1.default.USER);
                    const refreshToken = this.jwtCreate.generateRefreshToken(userFound._id, roles_1.default.USER);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        data: {
                            userData: {
                                name: userFound.name,
                                email: userFound.email,
                                isTradesman: userFound.isTradesman,
                                profile: (userFound === null || userFound === void 0 ? void 0 : userFound.profile) || "",
                                userId: userFound._id,
                            },
                            accessToken,
                            isAdmin: false,
                        },
                        refreshToken,
                    };
                }
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.BAD_REQUEST,
                data: "Incorrect email or password",
            };
        });
    }
    handleSocialLogin(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let userFound = yield this.userRepository.findByEmail(email);
            if (!userFound) {
                userFound = yield this.userRepository.save({
                    email,
                    name,
                    isGoogle: true,
                });
            }
            if (userFound === null || userFound === void 0 ? void 0 : userFound.isGoogle) {
                const accessToken = this.jwtCreate.generateAccessToken(userFound._id, roles_1.default.USER);
                const refreshToken = this.jwtCreate.generateRefreshToken(userFound._id, roles_1.default.USER);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: {
                        userData: {
                            name: userFound.name,
                            email: userFound.email,
                            isTradesman: userFound.isTradesman,
                            userId: userFound._id,
                        },
                        accessToken,
                    },
                    refreshToken,
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED,
                data: "No account found associated with this google account. Try normal login",
            };
        });
    }
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.userRepository.findByEmail(email);
            return {
                status: httpStatusCodes_1.STATUS_CODES.CONFLICT,
                data: userFound,
            };
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.encrypt.createHash(password);
            const userUpdate = yield this.userRepository.updatePassword(email, hashedPassword);
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
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield this.userRepository.findById(id);
            if (userFound) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: userFound,
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.NOT_FOUND,
                data: "User not found",
            };
        });
    }
    toggleBlock(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.toggleBlock(userId, status);
            if (user) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: {
                        status: "success",
                    },
                };
            }
        });
    }
    getUsers(page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.userRepository.getAllUsers(page, pageSize);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data,
            };
        });
    }
    updateUserProfile(id, name, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.userRepository.updateProfile(id, name, profile);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: {
                    userData: {
                        name: userInfo.name,
                        email: userInfo.email,
                        isTradesman: userInfo.isTradesman,
                        profile: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.profile) || "",
                        userId: userInfo._id,
                    },
                },
            };
        });
    }
    changeUserToTradesman(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepository.ChangeUserToTradesman(id);
            if (result) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: {
                        userData: {
                            name: result.name,
                            email: result.email,
                            isTradesman: result.isTradesman,
                            profile: (result === null || result === void 0 ? void 0 : result.profile) || "",
                            userId: result._id,
                        },
                    },
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.NOT_FOUND,
                data: "User not found",
            };
        });
    }
}
exports.default = UserUsecase;
//# sourceMappingURL=userUsecase.js.map