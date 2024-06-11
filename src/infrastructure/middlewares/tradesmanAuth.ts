import { STATUS_CODES } from "../constants/httpStatusCodes";
import ROLES from "../constants/roles";
import TradesmanRepository from "../repository/tradesmanRepository";
import { Req, Res, Next } from "../types/expressTypes";
import jwt, { JwtPayload } from "jsonwebtoken";

const tradesmanRepository = new TradesmanRepository();
const tradesmanAuth = async (req: Req, res: Res, next: Next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const accessToken = token.split(" ")[1];

            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_KEY as string
            ) as JwtPayload;

            if (decoded.role === ROLES.TRADESMAN) {
                const tradesman = await tradesmanRepository.findById(
                    decoded.userId
                );
                if (tradesman) {
                    (req as any).tradesman = tradesman._id as string;
                    next();
                    return;
                }
            }
        }

        res.status(STATUS_CODES.UNAUTHORIZED).json(
            "Unauthorized access, Invalid token"
        );
    } catch (error) {
        console.log(error);

        res.status(STATUS_CODES.UNAUTHORIZED).json(
            "Unauthorized access, Invalid token"
        );
    }
};
export default tradesmanAuth;
