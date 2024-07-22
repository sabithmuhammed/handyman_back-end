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
const constants_1 = require("../infrastructure/constants/constants");
class CommonController {
    constructor(userUsecase, adminUsecase, jwtCreate, razorpay) {
        this.userUsecase = userUsecase;
        this.adminUsecase = adminUsecase;
        this.jwtCreate = jwtCreate;
        this.razorpay = razorpay;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                let userFound = yield this.adminUsecase.emailExistCheck(email);
                console.log(userFound);
                if (userFound.data) {
                    const user = yield this.adminUsecase.loginAdmin(email, password);
                    if (user.refreshToken) {
                        res.cookie("refresh_token", user.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== "development",
                            sameSite: process.env.NODE_ENV !== "development"
                                ? "none"
                                : "strict",
                            maxAge: constants_1.REFRESH_TOKEN_MAX_AGE,
                        });
                    }
                    res.status(user.status).json(user.data);
                }
                else {
                    const user = yield this.userUsecase.loginUser(email, password);
                    if (user.refreshToken) {
                        res.cookie("refresh_token", user.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== "development",
                            sameSite: process.env.NODE_ENV !== "development"
                                ? "none"
                                : "strict",
                            maxAge: constants_1.REFRESH_TOKEN_MAX_AGE,
                        });
                    }
                    res.status(user.status).json(user.data);
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refresh_token;
                console.log(refreshToken);
                if (refreshToken) {
                    const accessToken = this.jwtCreate.createTokenIfRefreshTokenIsValid(refreshToken);
                    if (accessToken) {
                        return res.status(httpStatusCodes_1.STATUS_CODES.OK).json({
                            accessToken,
                        });
                    }
                }
                res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json("Unauthorized access.");
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie("refresh_token", "", {
                    httpOnly: true,
                    expires: new Date(0),
                });
                res.status(httpStatusCodes_1.STATUS_CODES.OK).json({
                    status: "success",
                    data: { message: "Logged out successfully" },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    amount: req.body.amount * 100, // amount in the smallest currency unit
                    currency: "INR",
                    receipt: "order_rcptid_11",
                };
                const order = yield this.razorpay.orders.create(options);
                res.status(httpStatusCodes_1.STATUS_CODES.OK).json(order);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = CommonController;
//# sourceMappingURL=commonController.js.map