import express from "express";
const route = express.Router();

import UserController from "../../adapter/userController";
import UserRepository from "../repository/userRepository";
import UserUsecase from "../../use_case/userUsecase";
import Encrypt from "../utils/hashPassword";
import JwtCreate from "../utils/jwtCreate";
import SendMail from "../utils/sendMail";
import GenerateOtp from "../utils/generateOtp";
import OtpRepository from "../repository/otpRepository";
import OtpUsecase from "../../use_case/otpUsecase";

const encrypt = new Encrypt();
const jwtCreate = new JwtCreate();
const generateOtp = new GenerateOtp();
const sendMail = new SendMail();

const repository = new UserRepository();
const useCase = new UserUsecase(repository, encrypt, jwtCreate);
const otpRepository = new OtpRepository();
const otpUsecase = new OtpUsecase(otpRepository, encrypt);
const controller = new UserController(
    useCase,
    generateOtp,
    sendMail,
    otpUsecase
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

route.get("/logout", (req, res, next) => controller.logout(req, res, next));

export default route;
