"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtCreate_1 = __importDefault(require("../utils/jwtCreate"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const userUsecase_1 = __importDefault(require("../../use_case/userUsecase"));
const commonController_1 = __importDefault(require("../../adapter/commonController"));
const adminUsecase_1 = __importDefault(require("../../use_case/adminUsecase"));
const adminRepository_1 = __importDefault(require("../repository/adminRepository"));
const razorpay_1 = __importDefault(require("razorpay"));
const commonRouter = express_1.default.Router();
const jwtCreate = new jwtCreate_1.default();
const encrypt = new hashPassword_1.default();
const userRepository = new userRepository_1.default();
const adminRepository = new adminRepository_1.default();
const userUsecase = new userUsecase_1.default(userRepository, encrypt, jwtCreate);
const adminUsecase = new adminUsecase_1.default(adminRepository, encrypt, jwtCreate);
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
const controller = new commonController_1.default(userUsecase, adminUsecase, jwtCreate, razorpay);
commonRouter.post("/login", (req, res, next) => controller.login(req, res, next));
commonRouter.get("/logout", (req, res, next) => controller.logout(req, res, next));
commonRouter.get("/refresh-token", (req, res, next) => controller.refreshToken(req, res, next));
commonRouter.post("/create-order", (req, res, next) => controller.createOrder(req, res, next));
exports.default = commonRouter;
//# sourceMappingURL=commonRoute.js.map