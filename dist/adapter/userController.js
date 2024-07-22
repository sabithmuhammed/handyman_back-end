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
class UserController {
    constructor(userUsecase, genOtp, sendMail, otpUsecase, tradesmanUsecase, cloudinary, fileOperations, toolUsecase) {
        this.userUsecase = userUsecase;
        this.genOtp = genOtp;
        this.sendMail = sendMail;
        this.otpUsecase = otpUsecase;
        this.tradesmanUsecase = tradesmanUsecase;
        this.cloudinary = cloudinary;
        this.fileOperations = fileOperations;
        this.toolUsecase = toolUsecase;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const userFound = yield this.userUsecase.emailExistCheck(user.email);
                if (!userFound.data) {
                    const otp = yield this.genOtp.generateOtp(6);
                    this.otpUsecase.saveOtp({ email: user.email, otp });
                    this.sendMail.sendOtpMail(user.email, user.name, otp);
                    res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ status: "success" });
                }
                else {
                    res.status(httpStatusCodes_1.STATUS_CODES.CONFLICT).json("Email Id already in use");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    signUpVerify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password, otp } = req.body;
                if (!(yield this.otpUsecase.compareOtp({ email, otp })).data) {
                    res.status(httpStatusCodes_1.STATUS_CODES.OK).json({
                        status: "failed",
                        message: "OTP doesn't match",
                    });
                    return;
                }
                const userData = {
                    name,
                    email,
                    password,
                };
                const newUser = yield this.userUsecase.saveUser(userData);
                this.otpUsecase.removeOtp(email);
                res.status(newUser.status).json({
                    status: "success",
                    data: newUser.data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resentOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name } = req.body;
                const otp = yield this.genOtp.generateOtp(6);
                this.otpUsecase.saveOtp({ email, otp });
                this.sendMail.sendOtpMail(email, name, otp);
                res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ status: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    socialLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name } = req.body;
                const user = yield this.userUsecase.handleSocialLogin(email, name);
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
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (email) {
                    const userFound = yield this.userUsecase.emailExistCheck(email);
                    if (userFound.data) {
                        const { email, name } = userFound.data;
                        const otp = yield this.genOtp.generateOtp(6);
                        this.otpUsecase.saveOtp({ email, otp });
                        this.sendMail.sendOtpMail(email, name, otp);
                        res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ name, email });
                    }
                    else {
                        res.status(httpStatusCodes_1.STATUS_CODES.NOT_FOUND).json("No account found associated with this email.");
                    }
                }
                throw new Error("ValidationError");
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPasswordVerifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!(yield this.otpUsecase.compareOtp({ email, otp })).data) {
                    res.status(httpStatusCodes_1.STATUS_CODES.OK).json({
                        status: "failed",
                        message: "OTP doesn't match",
                    });
                    return;
                }
                res.status(httpStatusCodes_1.STATUS_CODES.OK).json({ status: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPasswordChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, password } = req.body;
                if (!(yield this.otpUsecase.compareOtp({ email, otp })).data) {
                    throw new Error("UnauthorizedError");
                }
                yield this.otpUsecase.removeOtp(email);
                const updateUser = yield this.userUsecase.changePassword(email, password);
                const status = updateUser ? "success" : "failed";
                res.status(updateUser.status).json({ status });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTradesmen(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, pageSize, longitude, latitude, category } = req.query;
                const tradesmen = yield this.tradesmanUsecase.getTradesmen(Number(page), Number(pageSize), {
                    category: category,
                    coordinates: [Number(longitude), Number(latitude)],
                });
                res.status(tradesmen.status).json(tradesmen.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addTool(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, rent, street, city, state, country, pincode, latitude, longitude, } = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const imagesRaw = req.files;
                const images = yield Promise.all(imagesRaw.map((image) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.cloudinary.saveToCloudinary(image);
                })));
                const tool = {
                    name,
                    rent,
                    city,
                    country,
                    images,
                    location: {
                        coordinates: [latitude, longitude],
                        type: "Point",
                    },
                    pincode,
                    state,
                    street,
                    userId,
                };
                const data = yield this.toolUsecase.addNewTool(tool);
                //deleting images from directory after uploading to cloud
                yield this.fileOperations.deleteFile(imagesRaw.map(({ path }) => path));
                if (data.data) {
                    return res.status(data.status).json(data.data);
                }
                return res.status(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST).json("Invalid data");
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTools(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tools = yield this.toolUsecase.getTools();
                return res.status(tools.status).json(tools.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMyTools(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const tools = yield this.toolUsecase.getMyTools(userId);
                return res.status(tools.status).json(tools.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllSkills(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.tradesmanUsecase.getAllSkills();
                return res.status(data.status).json(data.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const data = yield this.userUsecase.getUserById(userId);
                return res.status(data.status).json(data.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, profile } = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const image = req.file;
                if (image) {
                    profile = yield this.cloudinary.saveToCloudinary(image);
                    yield this.fileOperations.deleteFile(image.path);
                }
                const data = yield this.userUsecase.updateUserProfile(userId, name, profile);
                res.status(data.status).json(data.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllTradesmen(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, pageSize, longitude, category } = req.query;
                const tradesmen = yield this.tradesmanUsecase.getAllTradesmen(Number(page), Number(pageSize), {
                    category: category,
                });
                res.status(tradesmen.status).json(tradesmen.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map