import User from "../../domain/user";

export default interface IUserRepository {
    save(user: User): Promise<any>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updatePassword(email: string, password: string): Promise<User | null>;
    toggleBlock(userId: string, status: boolean): Promise<User | null>;
    getAllUsers(
        page: string | undefined,
        pageSize: string | undefined
    ): Promise<{
        users: User[] | null;
        totalCount: number;
        page: number;
    }>;
    updateProfile(id: string, name: string, profile: string): Promise<User>;
    ChangeUserToTradesman(id: string): Promise<User | null>;
}
