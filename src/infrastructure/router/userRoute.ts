import express from "express";
const route = express.Router();

import UserController from "../../adapter/userController";
import UserRepository from "../repository/userRepository";
import UserUsecase from "../../use_case/userUsecase";
import Encrypt from "../utils/hashPassword";
import JwtCreate from "../utils/jwtCreate";

const encrypt = new Encrypt();
const jwtCreate = new JwtCreate();

const repository = new UserRepository();
const useCase = new UserUsecase(repository, encrypt, jwtCreate);
const controller = new UserController(useCase);

route.post('/signup',(req,res)=>controller.signUp(req,res))



export default route