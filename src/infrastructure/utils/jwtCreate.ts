import Ijwt from "../../use_case/interface/jwtInterface";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
    ACCESS_TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE,
} from "../constants/constants";

export default class JwtCreate implements Ijwt {
    generateAccessToken(userId: string, role: string): string {
        const KEY = process.env.JWT_KEY;
        if (KEY) {
            const exp = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE;
            return jwt.sign({ userId, role, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error("JWT key is not defined");
    }
    generateRefreshToken(userId: string, role: string): string {
        const KEY = process.env.JWT_KEY;
        if (KEY) {
            const exp = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_MAX_AGE;
            return jwt.sign({ userId, role, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error("JWT key is not defined");
    }
    createTokenIfRefreshTokenIsValid(token: string): string | null {
        try {
            const decode = jwt.verify(
                token,
                process.env.JWT_KEY as string
            ) as JwtPayload;
            const accessToken = this.generateAccessToken(
                decode.userId,
                decode.role
            );
            return accessToken;
        } catch (error) {
            return null;
        }
    }
}
