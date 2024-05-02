import bcrypt from "bcrypt";
import HashPassword from "../../use_case/interface/hashPassword";


export default class Encrypt implements HashPassword {
    async createHash(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }

    async compare(password: string, HashPassword: string): Promise<boolean> {
        const passwordMatch = await bcrypt.compare(password, HashPassword);
        return passwordMatch;
    }
}
