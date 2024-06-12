import express from "express";
const route = express.Router();

import UserController from "../../adapter/userController";
import UserRepository from "../repository/userRepository";
import TradesmanRepository from "../repository/tradesmanRepository";
import TradesmanUsecase from "../../use_case/tradesmanUsecase";
import UserUsecase from "../../use_case/userUsecase";
import Encrypt from "../utils/hashPassword";
import JwtCreate from "../utils/jwtCreate";
import SendMail from "../utils/sendMail";
import GenerateOtp from "../utils/generateOtp";
import OtpRepository from "../repository/otpRepository";
import OtpUsecase from "../../use_case/otpUsecase";
import Cloudinary from "../utils/cloudinary";
import FileOperations from "../utils/fileOperations";
import ToolRepository from "../repository/toolRepository";
import ToolUsecase from "../../use_case/toolUsecase";
import { Multer } from "../middlewares/multer";
import userAuth from "../middlewares/userAuth";

const encrypt = new Encrypt();
const jwtCreate = new JwtCreate();
const generateOtp = new GenerateOtp();
const sendMail = new SendMail();
const cloudinary = new Cloudinary();
const fileOperations = new FileOperations();

const repository = new UserRepository();
const useCase = new UserUsecase(repository, encrypt, jwtCreate);
const tradesmanRepository = new TradesmanRepository();
const tradesmanUsecase = new TradesmanUsecase(tradesmanRepository, jwtCreate);
const otpRepository = new OtpRepository();
const otpUsecase = new OtpUsecase(otpRepository, encrypt);
const toolRepository = new ToolRepository();
const toolUsecase = new ToolUsecase(toolRepository);
const controller = new UserController(
    useCase,
    generateOtp,
    sendMail,
    otpUsecase,
    tradesmanUsecase,
    cloudinary,
    fileOperations,
    toolUsecase
);

route.post("/signup", (req, res, next) => controller.signUp(req, res, next));

route.post("/signup-verify", (req, res, next) =>
    controller.signUpVerify(req, res, next)
);

route.post("/resent-otp", (req, res, next) =>
    controller.resentOtp(req, res, next)
);

route.post("/forgot-password", (req, res, next) =>
    controller.forgotPassword(req, res, next)
);

route.post("/forgot-password-verify", (req, res, next) =>
    controller.forgotPasswordVerifyOtp(req, res, next)
);

route.post("/forgot-password-change", (req, res, next) =>
    controller.forgotPasswordChange(req, res, next)
);

route.post("/google-signup", (req, res, next) =>
    controller.socialLogin(req, res, next)
);

route.get("/get-tradesmen", (req, res, next) =>
    controller.getTradesmen(req, res, next)
);

route.post("/add-tool", Multer.array("images"), userAuth, (req, res, next) =>
    controller.addTool(req, res, next)
);

route.get("/get-tools", (req, res, next) =>
    controller.getTools(req, res, next)
);

route.get("/get-user-info/:userId", (req, res, next) =>
    controller.getUserInfo(req, res, next)
);

route.get("/get-skills", (req, res, next) =>
    controller.getAllSkills(req, res, next)
);

export default route;
