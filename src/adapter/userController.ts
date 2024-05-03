import {Request, Response, json} from 'express';
import UserUsecase from '../use_case/userUsecase';
import User from '../domain/user';
import jwt,{JwtPayload} from 'jsonwebtoken';
import SendMail from '../infrastructure/utils/sendMail';
import GenerateOtp from '../infrastructure/utils/generateOtp';

export default class UserController{
    constructor(
        private userUsecase:UserUsecase,
        private generateOtp:GenerateOtp,
        private sendMail:SendMail
    ){}

    async signUp(req:Request,res:Response){
        try {
            const user = req.body;
            console.log(user);
            const userFound = await this.userUsecase.emailExistCheck(user.email);
            if(!userFound.data){
                const newUser = await this.userUsecase.saveUser(user)
                res.status(newUser.status).json({status:"success",data:newUser.data})
            }else{
                res.status(200).json({status:"failed",message:"Email Id already in use"})
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}