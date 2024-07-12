import express from "express";
import { Req, Res, Next } from "../types/expressTypes";
import jwt, { JwtPayload } from "jsonwebtoken";
import JwtCreate from "../utils/jwtCreate";
import Encrypt from "../utils/hashPassword";
import UserRepository from "../repository/userRepository";
import UserUsecase from "../../use_case/userUsecase";
import CommonController from "../../adapter/commonController";
import AdminUsecase from "../../use_case/adminUsecase";
import AdminRepository from "../repository/adminRepository";
import Razorpay from 'razorpay';

const commonRouter = express.Router();

const jwtCreate = new JwtCreate();
const encrypt = new Encrypt();
const userRepository = new UserRepository();
const adminRepository = new AdminRepository();
const userUsecase = new UserUsecase(userRepository, encrypt, jwtCreate);
const adminUsecase = new AdminUsecase(adminRepository, encrypt, jwtCreate)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY as string,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
const controller = new CommonController(userUsecase,adminUsecase, jwtCreate,razorpay);

commonRouter.post("/login", (req: Req, res: Res, next: Next) =>
    controller.login(req, res, next)
);

commonRouter.get("/logout", (req, res, next) => controller.logout(req, res, next));

commonRouter.get("/refresh-token", (req: Req, res: Res, next: Next) =>
    controller.refreshToken(req, res, next)
);

commonRouter.post("/create-order", (req: Req, res: Res, next: Next) =>
    controller.createOrder(req, res, next)
);

export default commonRouter;