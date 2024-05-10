import User from "../../domain/user";
import UserModel from "../database/userModel";
import UserRepositoryInterface from "../../use_case/interface/userRepositoryInterface";

export default class UserRepository implements UserRepositoryInterface {
    async save(user: User): Promise<any> {
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser;
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            return user;
        } else {
            return null;
        }
    }
    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        if (user) {
            return user;
        } else {
            return null;
        }
    }
    async updatePassword(
        email: string,
        password: string
    ): Promise<User | null> {
        const user = await UserModel.findOneAndUpdate(
            { email },
            { $set: { password } }
        );
        return user;
    }
}
