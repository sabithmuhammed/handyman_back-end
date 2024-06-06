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
    async getAllUsers(
        page: string | undefined,
        pageSize: string | undefined
    ): Promise<{
        users: User[] | null;
        totalCount: number;
        page: number;
    }> {
        
        let users: User[] | null = null;
        const offset =
            (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
        const totalCount = await UserModel.countDocuments({});

        users = await UserModel.find({}, { password: 0 })
            .skip(offset)
            .limit(pageSize ? Number(pageSize) : 10);

        return {
            users,
            totalCount,
            page: page ? Number(page) : 1,
        };
    }
}
