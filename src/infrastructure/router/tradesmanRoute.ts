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

const tradesmanRouter = express.Router();

const jwtCreate = new JwtCreate();
const cloudinary = new Cloudinary();
const fileOperations = new FileOperations();

const tradesmanRepository = new TradesmanRepository();
const tradesmanUsecase = new TradesmanUsecase(tradesmanRepository, jwtCreate);

const controller = new TradesmanController(
    tradesmanUsecase,
    jwtCreate,
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

export default tradesmanRouter;
