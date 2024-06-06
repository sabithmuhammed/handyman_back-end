import express from "express";
import { Req, Res, Next } from "../types/expressTypes";
import JwtCreate from "../utils/jwtCreate";
import TradesmanRepository from "../repository/tradesmanRepository";
import TradesmanUsecase from "../../use_case/tradesmanUsecase";
import AdminController from "../../adapter/adminController";
import SendMail from "../utils/sendMail";
import UserUsecase from "../../use_case/userUsecase";
import UserRepository from "../repository/userRepository";
import Encrypt from "../utils/hashPassword";
import adminAuth from "../middlewares/adminAuth";

const adminRouter = express.Router();

const jwtCreate = new JwtCreate();
const tradesmanRepository = new TradesmanRepository();
const tradesmanUsecase = new TradesmanUsecase(tradesmanRepository, jwtCreate);
const userRepository = new UserRepository();
const encrypt = new Encrypt();
const userUsecase = new UserUsecase(userRepository, encrypt, jwtCreate);
const sendMail = new SendMail();

const controller = new AdminController(tradesmanUsecase, userUsecase, sendMail);

adminRouter.get(
    "/get-verification",
    adminAuth,
    (req: Req, res: Res, next: Next) => controller.getPending(req, res, next)
);

adminRouter.patch(
    "/verify-tradesman",
    adminAuth,
    (req: Req, res: Res, next: Next) =>
        controller.verifyTradesman(req, res, next)
);
adminRouter.patch(
    "/reject-tradesman",
    adminAuth,
    (req: Req, res: Res, next: Next) =>
        controller.rejectTradesman(req, res, next)
);
adminRouter.get("/get-tradesmen", adminAuth, (req: Req, res: Res, next: Next) =>
    controller.getTradesmen(req, res, next)
);

adminRouter.get("/get-users", adminAuth, (req: Req, res: Res, next: Next) =>
    controller.getUsers(req, res, next)
);

adminRouter.patch("/block-user", adminAuth, (req: Req, res: Res, next: Next) =>
    controller.userBlock(req, res, next)
);
adminRouter.patch(
    "/unblock-user",
    adminAuth,
    (req: Req, res: Res, next: Next) => controller.userUnblock(req, res, next)
);

adminRouter.patch(
    "/block-tradesman",
    adminAuth,
    (req: Req, res: Res, next: Next) =>
        controller.tradesmanBlock(req, res, next)
);
adminRouter.patch(
    "/unblock-tradesman",
    adminAuth,
    (req: Req, res: Res, next: Next) =>
        controller.tradesmanUnblock(req, res, next)
);

export default adminRouter;
