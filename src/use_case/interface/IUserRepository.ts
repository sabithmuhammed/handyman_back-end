import User from "../../domain/user";

export default interface IUserRepository {
    save(user: User): Promise<any>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updatePassword(email:string,password:string):Promise<User | null>;
    toggleBlock(userId:string,status:boolean):Promise<User | null>;
}
