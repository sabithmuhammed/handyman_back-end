import User from "../../domain/user";
import UserModel from "../database/userModel";
import UserRepositoryInterface from "../../use_case/interface/userRepositoryInterface";


export default class UserRepository implements UserRepositoryInterface{
    async save(user: User): Promise<any> {
        const newUser = new UserModel(user)
        await newUser.save()
        return newUser
    }
}