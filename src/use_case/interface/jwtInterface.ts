import { JwtPayload } from "jsonwebtoken";

export default interface Ijwt {
    generateAccessToken(userId: string, role: string): string;
    generateRefreshToken(userId: string, role: string): string;
    createTokenIfRefreshTokenIsValid(token: string): string | null;
}
