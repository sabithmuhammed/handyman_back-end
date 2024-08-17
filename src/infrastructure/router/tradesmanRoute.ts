import express from "express";
import { Req, Res, Next } from "../types/expressTypes";
import JwtCreate from "../utils/jwtCreate";
import TradesmanRepository from "../repository/tradesmanRepository";
import TradesmanUsecase from "../../use_case/tradesmanUsecase";
import TradesmanController from "../../adapter/tradesmanController";
import multer from "multer";
import { Multer } from "../middlewares/multer";
import userAuth from "../middlewares/userAuth";
import Cloudinary from "../utils/cloudinary";
import FileOperations from "../utils/fileOperations";
import PostRepository from "../repository/postRepository";
import PostUsecase from "../../use_case/postUsecase";
import tradesmanAuth from "../middlewares/tradesmanAuth";

const tradesmanRouter = express.Router();

const jwtCreate = new JwtCreate();
const cloudinary = new Cloudinary();
const fileOperations = new FileOperations();

const tradesmanRepository = new TradesmanRepository();
const tradesmanUsecase = new TradesmanUsecase(tradesmanRepository, jwtCreate);


const controller = new TradesmanController(
    tradesmanUsecase,
    cloudinary,
    fileOperations
);

tradesmanRouter.post(
    "/register",
    Multer.array("images"),
    userAuth,
    (req: Req, res: Res, next: Next) => controller.register(req, res, next)
);
tradesmanRouter.get(
    "/check-status",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        controller.tradesmanExistCheck(req, res, next)
);

tradesmanRouter.get(
    "/get-profile/:tradesmanId",
    (req: Req, res: Res, next: Next) =>
        controller.getProfileMinimum(req, res, next)
);

tradesmanRouter.get(
    "/get-profile-full",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        controller.getProfileFull(req, res, next)
);


tradesmanRouter.patch(
    "/update-working-time",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        controller.updateWorkingTime(req, res, next)
);

tradesmanRouter.patch(
    "/add-service",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) => controller.addNewService(req, res, next)
);

tradesmanRouter.delete(
    "/delete-service/:serviceId",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) => controller.deleteService(req, res, next)
);

tradesmanRouter.patch(
    "/update-service/:serviceId",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) => controller.updateService(req, res, next)
);

tradesmanRouter.patch(
    "/add-leave",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) => controller.addLeave(req, res, next)
);

tradesmanRouter.delete(
    "/remove-leave/:date",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) => controller.removeLeave(req, res, next)
);

export default tradesmanRouter;
