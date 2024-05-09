import express from "express";
import { Req, Res, Next } from "../types/expressTypes";
import jwt, { JwtPayload } from "jsonwebtoken";
import JwtCreate from "../utils/jwtCreate";
import Encrypt from "../utils/hashPassword";
import UserRepository from "../repository/userRepository";
import UserUsecase from "../../use_case/userUsecase";
import CommonController from "../../adapter/commonController";

const commonRouter = express.Router();

const jwtCreate = new JwtCreate();
const encrypt = new Encrypt();
const repository = new UserRepository();
const useCase = new UserUsecase(repository, encrypt, jwtCreate);

const controller = new CommonController(useCase, jwtCreate);

commonRouter.post("/login", (req: Req, res: Res, next: Next) =>
    controller.login(req, res, next)
);

commonRouter.get("/refresh-token", (req: Req, res: Res, next: Next) =>
    controller.refreshToken(req, res, next)
);

export default commonRouter;
