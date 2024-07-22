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
class TradesmanController {
    constructor(tradesmanUsecase, cloudinary, fileOperations) {
        this.tradesmanUsecase = tradesmanUsecase;
        this.cloudinary = cloudinary;
        this.fileOperations = fileOperations;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, category, experience, latitude, longitude } = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const images = req.files;
                const profile = yield this.cloudinary.saveToCloudinary(images[0]);
                const idProof = yield this.cloudinary.saveToCloudinary(images[1]);
                const tradesman = yield this.tradesmanUsecase.saveTradesman({
                    name,
                    userId,
                    category,
                    experience,
                    location: {
                        coordinates: [longitude, latitude],
                        type: "Point",
                    },
                    profile,
                    idProof,
                });
                //deleting images from directory after uploading to cloud
                yield this.fileOperations.deleteFile(images.map(({ path }) => path));
                res.status(httpStatusCodes_1.STATUS_CODES.OK).json("Registered Successfully");
            }
            catch (error) {
                next(error);
            }
        });
    }
    tradesmanExistCheck(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const tradesman = yield this.tradesmanUsecase.checkExistByUserId(userId);
                if (tradesman.refreshToken) {
                    res.cookie("refresh_token", tradesman.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite: process.env.NODE_ENV !== "development"
                            ? "none"
                            : "strict",
                        maxAge: constants_1.REFRESH_TOKEN_MAX_AGE,
                    });
                }
                res.status(tradesman.status).json(tradesman.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProfileMinimum(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req.params.tradesmanId;
                const result = yield this.tradesmanUsecase.getProfileMinimum(tradesmanId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProfileFull(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req === null || req === void 0 ? void 0 : req.tradesman;
                const result = yield this.tradesmanUsecase.getProfileFull(tradesmanId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateConfiguration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req === null || req === void 0 ? void 0 : req.tradesman;
                const { startingTime, endingTime, bufferTime, services, slotSize, workingDays, } = req.body;
                let hasError = false;
                if (startingTime >= endingTime) {
                    hasError = true;
                }
                if (workingDays.every((day) => !day)) {
                    hasError = true;
                }
                if (Number(slotSize) < 0.5) {
                    hasError = true;
                }
                const allFilled = services.every((item) => item.description && item.amount && item.slots);
                if (!allFilled) {
                    hasError = true;
                }
                if (hasError) {
                    throw new Error("ValidationError");
                }
                const result = yield this.tradesmanUsecase.updateConfiguration(tradesmanId, {
                    startingTime,
                    endingTime,
                    bufferTime: Number(bufferTime),
                    services,
                    slotSize: Number(slotSize),
                    workingDays,
                });
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = TradesmanController;
//# sourceMappingURL=tradesmanController.js.map