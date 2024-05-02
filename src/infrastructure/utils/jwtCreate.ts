import Ijwt from "../../use_case/interface/jwtInterface";
import jwt from "jsonwebtoken";

export default class JwtCreate implements Ijwt {
    createJWT(userId: string, role: string): string {
        const jwtKey = process.env.JWT_KEY;
        if (jwtKey) {
            const token: string = jwt.sign({ id: userId, role: role }, jwtKey);
            return token;
        }
        throw new Error("JWT_KEY is not defined");
    }
}
