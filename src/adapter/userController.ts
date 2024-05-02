import {Request, Response, json} from 'express';
import UserUsecase from '../use_case/userUsecase';
import User from '../domain/user';
import jwt,{JwtPayload} from 'jsonwebtoken';

export default class UserController{
    constructor(
        private userUsecase:UserUsecase
    ){}

    async signUp(req:Request,res:Response){
        try {
            const user = req.body;
            console.log(user);
            const newUser = await this.userUsecase.saveUser(user)
            res.status(newUser.status).json(newUser.data)
        } catch (error) {
            console.log(error);
            
        }
    }
}