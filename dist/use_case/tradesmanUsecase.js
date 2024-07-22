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
class TradesmanUsecase {
    constructor(tradesmanRepository, jwtCreate) {
        this.tradesmanRepository = tradesmanRepository;
        this.jwtCreate = jwtCreate;
    }
    saveTradesman(tradesman) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTradesman = yield this.tradesmanRepository.saveTradesman(tradesman);
            return {
                status: httpStatusCodes_1.STATUS_CODES.CREATED,
                data: {
                    newTradesman,
                },
            };
        });
    }
    checkExistByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield this.tradesmanRepository.findByUserId(userId);
            if (tradesman) {
                if (tradesman.verificationStatus == "verified") {
                    const accessToken = this.jwtCreate.generateAccessToken(tradesman._id, roles_1.default.TRADESMAN);
                    const refreshToken = this.jwtCreate.generateRefreshToken(tradesman._id, roles_1.default.TRADESMAN);
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        data: {
                            status: "Verified",
                            data: {
                                name: tradesman.name,
                                profile: tradesman.profile,
                                accessToken,
                                tradesmanId: tradesman._id,
                            },
                        },
                        refreshToken,
                    };
                }
                else if (tradesman.verificationStatus == "rejected") {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.OK,
                        data: {
                            status: "Rejected",
                        },
                    };
                }
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: {
                        status: "Not verified",
                    },
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: {
                    status: "Not found",
                },
            };
        });
    }
    getPendingVerifications() {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesmen = yield this.tradesmanRepository.getAllPendingTradesmen();
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: tradesmen,
            };
        });
    }
    changeVerificationStatus(tradesmanId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield this.tradesmanRepository.changeVerificationStatus(tradesmanId, status);
            if (tradesman) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: tradesman,
                };
            }
        });
    }
    getTradesmen(page, pageSize, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.tradesmanRepository.getAllTradesmanWithFilter(page, pageSize, filters);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data,
            };
        });
    }
    toggleBlock(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield this.tradesmanRepository.toggleBlock(userId, status);
            if (tradesman) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: {
                        status: "success",
                    },
                };
            }
        });
    }
    getAllSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.tradesmanRepository.getUniqueSkills();
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    getProfileMinimum(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.tradesmanRepository.findById(id);
            if (result) {
                const { _id, name, profile, experience, location, category, rating, configuration } = result;
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: {
                        _id,
                        name,
                        profile,
                        experience,
                        location,
                        category,
                        rating,
                        configuration
                    },
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: null,
            };
        });
    }
    getAllTradesmen(page, pageSize, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.tradesmanRepository.getAllTradesman(page, pageSize, filters);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data,
            };
        });
    }
    getProfileFull(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.tradesmanRepository.getProfileFull(tradesmanId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data,
            };
        });
    }
    updateConfiguration(tradesmanId, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.tradesmanRepository.updateConfiguration(tradesmanId, config);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data,
            };
        });
    }
}
exports.default = TradesmanUsecase;
//# sourceMappingURL=tradesmanUsecase.js.map