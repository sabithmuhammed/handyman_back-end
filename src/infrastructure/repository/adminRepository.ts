import Admin from "../../domain/admin";
import AdminModel from "../database/adminModel";
import IAdminRepository from "../../use_case/interface/IAdminRepository";

export default class AdminRepository implements IAdminRepository {
    async save(user: Admin): Promise<any> {
        const newAdmin = new AdminModel(user);
        await newAdmin.save();
        return newAdmin;
    }
    async findByEmail(email: string): Promise<Admin | null> {
        const user = await AdminModel.findOne({ email: email });
        if (user) {
            return user;
        } else {
            return null;
        }
    }
    async findById(id: string): Promise<Admin | null> {
        const user = await AdminModel.findById(id);
        if (user) {
            return user;
        } else {
            return null;
        }
    }
    async updatePassword(
        email: string,
        password: string
    ): Promise<Admin | null> {
        const user = await AdminModel.findOneAndUpdate(
            { email },
            { $set: { password } }
        );
        return user;
    }
}
