import { STATUS_CODES } from "../constants/httpStatusCodes";
import UserRepository from "../repository/userRepository";
import { Req, Res, Next } from "../types/expressTypes";
import jwt, { JwtPayload } from "jsonwebtoken";

const userRepository = new UserRepository();

const userAuth = async (req: Req, res: Res, next: Next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const accessToken = token.split(" ")[1];
            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_KEY as string
            ) as JwtPayload;
            const userData = await userRepository.findByEmail(decoded.userId);
            if (userData) {
                if (userData.isBlocked) {
                    res.status(STATUS_CODES.FORBIDDEN).json(
                        "You have been blocked."
                    );
                    return;
                }
                next();
                return;
            }
        }
        res.status(STATUS_CODES.UNAUTHORIZED).json(
            "Unauthorized access, Invalid token"
        );
    } catch (error) {
        res.status(STATUS_CODES.UNAUTHORIZED).json(
            "Unauthorized access, Invalid token"
        );
    }
};
export default userAuth;
