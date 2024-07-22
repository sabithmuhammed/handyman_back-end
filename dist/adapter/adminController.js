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
const httpStatusCodes_1 = require("../infrastructure/constants/httpStatusCodes");
class AdminController {
    constructor(tradesmanUsecase, userUsecase, sendMail) {
        this.tradesmanUsecase = tradesmanUsecase;
        this.userUsecase = userUsecase;
        this.sendMail = sendMail;
    }
    getPending(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmen = yield this.tradesmanUsecase.getPendingVerifications();
                res.status(tradesmen.status).json(tradesmen.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyTradesman(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { tradesmanId } = req.body;
                const tradesman = yield this.tradesmanUsecase.changeVerificationStatus(tradesmanId, "verified");
                if (tradesman) {
                    yield this.userUsecase.changeUserToTradesman(tradesman.data.userId);
                    const user = yield this.userUsecase.getUserById(tradesman.data.userId);
                    if (typeof user.data !== "string") {
                        this.sendMail.sendVerifyMail((_a = user.data) === null || _a === void 0 ? void 0 : _a.email, tradesman.data.name);
                    }
                    return res.status(tradesman.status).json(tradesman.data);
                }
                res.status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND).json("No tradesman found.");
            }
            catch (error) {
                next(error);
            }
        });
    }
    rejectTradesman(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { tradesmanId } = req.body;
                const tradesman = yield this.tradesmanUsecase.changeVerificationStatus(tradesmanId, "rejected");
                if (tradesman) {
                    const user = yield this.userUsecase.getUserById(tradesman.data.userId);
                    if (typeof user.data !== "string") {
                        this.sendMail.sendRejectMail((_a = user.data) === null || _a === void 0 ? void 0 : _a.email, tradesman.data.name);
                    }
                    res.status(tradesman.status).json(tradesman.data);
                }
                res.status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND).json("No tradesman found.");
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTradesmen(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page;
                const pageSize = req.query.pageSize;
                // const tradesman = await this.tradesmanUsecase.getTradesmen(
                //     page,
                //     pageSize
                // );
                // return res.status(tradesman.status).json(tradesman.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page;
                const pageSize = req.query.pageSize;
                const tradesman = yield this.userUsecase.getUsers(page, pageSize);
                return res.status(tradesman.status).json(tradesman.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    userBlock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const user = yield this.userUsecase.toggleBlock(userId, true);
                if (user) {
                    return res.status(user.status).json(user.data);
                }
                return res.status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND).json("User not found");
            }
            catch (error) {
                next(error);
            }
        });
    }
    userUnblock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const user = yield this.userUsecase.toggleBlock(userId, false);
                if (user) {
                    return res.status(user.status).json(user.data);
                }
                return res.status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND).json("User not found");
            }
            catch (error) {
                next(error);
            }
        });
    }
    tradesmanBlock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tradesmanId } = req.body;
                const tradesman = yield this.tradesmanUsecase.toggleBlock(tradesmanId, true);
                if (tradesman) {
                    return res.status(tradesman.status).json(tradesman.data);
                }
                return res
                    .status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND)
                    .json("Tradesman not found");
            }
            catch (error) {
                next(error);
            }
        });
    }
    tradesmanUnblock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tradesmanId } = req.body;
                const tradesman = yield this.tradesmanUsecase.toggleBlock(tradesmanId, false);
                if (tradesman) {
                    return res.status(tradesman.status).json(tradesman.data);
                }
                return res
                    .status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND)
                    .json("Tradesman not found");
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map