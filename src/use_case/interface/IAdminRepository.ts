import Admin from "../../domain/admin";

export default interface IAdminRepository {
    save(user: Admin): Promise<any>;
    findByEmail(email: string): Promise<Admin | null>;
    updatePassword(email:string,password:string):Promise<Admin | null>
}