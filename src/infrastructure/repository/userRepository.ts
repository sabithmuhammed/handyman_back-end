import User from "../../domain/user";
import UserModel from "../database/userModel";
import IUserRepository from "../../use_case/interface/IUserRepository";

export default class UserRepository implements IUserRepository {
    async save(user: User): Promise<any> {
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email: email });
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        return user;
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

    async toggleBlock(userId: string, status: boolean): Promise<User | null> {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: { isBlocked: status },
            },
            { new: true }
        );
        return user;
    }
}
