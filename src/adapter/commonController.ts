import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import UserUsecase from "../use_case/userUsecase";
import { REFRESH_TOKEN_MAX_AGE } from "../infrastructure/constants/constants";
import JwtCreate from "../infrastructure/utils/jwtCreate";

export default class CommonController {
    constructor(
        private userUsecase: UserUsecase,
        private jwtCreate: JwtCreate
    ) {}

    async login(req: Req, res: Res, next: Next) {
        try {
            const { email, password } = req.body;
            const user = await this.userUsecase.loginUser(email, password);
            if (user.refreshToken) {
                res.cookie("refresh_token", user.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite:
                        process.env.NODE_ENV !== "development"
                            ? "none"
                            : "strict",
                    maxAge:REFRESH_TOKEN_MAX_AGE,
                });
            }

            res.status(user.status).json(user.data);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async refreshToken(req: Req, res: Res, next: Next) {
        try {
            const refreshToken = req.cookies.refresh_token;
            if (refreshToken) {
                const accessToken =
                    this.jwtCreate.createTokenIfRefreshTokenIsValid(refreshToken);
                if (accessToken) {
                    res.status(STATUS_CODES.OK).json({
                        accessToken,
                    });
                }
            }
            res.status(STATUS_CODES.UNAUTHORIZED).json("Unauthorized access.");
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
