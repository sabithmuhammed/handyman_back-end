import User from "../../domain/user";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import ROLES from "../constants/roles";
import TradesmanRepository from "../repository/tradesmanRepository";
import UserRepository from "../repository/userRepository";
import { Req, Res, Next } from "../types/expressTypes";
import jwt, { JwtPayload } from "jsonwebtoken";

const userRepository = new UserRepository();
const tradesmanRepository = new TradesmanRepository();

const userAuth = async (req: Req, res: Res, next: Next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const accessToken = token.split(" ")[1];
            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_KEY as string
            ) as JwtPayload;
            if (
                decoded.role === ROLES.USER ||
                decoded.role === ROLES.TRADESMAN
            ) {
                let userId: string | null = null;
                if (decoded.role === ROLES.TRADESMAN) {
                    const tradesman = await tradesmanRepository.findById(
                        decoded.userId
                    );
                    if (tradesman) {
                        userId = tradesman.userId as string;
                    }
                }
                const userData = await userRepository.findById(
                    userId || decoded.userId
                );

                if (userData) {
                    if (userData.isBlocked) {
                        res.status(STATUS_CODES.FORBIDDEN).json(
                            "You have been blocked."
                        );
                        return;
                    }
                    (req as any).user = userData._id;
                    (req as any).senderId = decoded.userId;
                    next();
                    return;
                }
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
