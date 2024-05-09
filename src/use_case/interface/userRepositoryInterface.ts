import User from "../../domain/user";

export default interface UserRepositoryInterface {
    save(user: User): Promise<any>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
