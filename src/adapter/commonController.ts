import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import UserUsecase from "../use_case/userUsecase";
import { REFRESH_TOKEN_MAX_AGE } from "../infrastructure/constants/constants";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import AdminUsecase from "../use_case/adminUsecase";
import Razorpay from "razorpay";

export default class CommonController {
    constructor(
        private userUsecase: UserUsecase,
        private adminUsecase: AdminUsecase,
        private jwtCreate: JwtCreate,
        private razorpay: Razorpay
    ) {}

    async login(req: Req, res: Res, next: Next) {
        try {
            const { email, password } = req.body;
            let userFound = await this.adminUsecase.emailExistCheck(email);
            console.log(userFound);

            if (userFound.data) {
                const user = await this.adminUsecase.loginAdmin(
                    email,
                    password
                );
                if (user.refreshToken) {
                    res.cookie("refresh_token", user.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite:
                            process.env.NODE_ENV !== "development"
                                ? "none"
                                : "strict",
                        maxAge: REFRESH_TOKEN_MAX_AGE,
                    });
                }

                res.status(user.status).json(user.data);
            } else {
                const user = await this.userUsecase.loginUser(email, password);
                if (user.refreshToken) {
                    res.cookie("refresh_token", user.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite:
                            process.env.NODE_ENV !== "development"
                                ? "none"
                                : "strict",
                        maxAge: REFRESH_TOKEN_MAX_AGE,
                    });
                }

                res.status(user.status).json(user.data);
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async refreshToken(req: Req, res: Res, next: Next) {
        try {
            const refreshToken = req.cookies.refresh_token;
            console.log(refreshToken);

            if (refreshToken) {
                const accessToken =
                    this.jwtCreate.createTokenIfRefreshTokenIsValid(
                        refreshToken
                    );
                if (accessToken) {
                    return res.status(STATUS_CODES.OK).json({
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

    async logout(req: Req, res: Res, next: Next) {
        try {
            res.cookie("refresh_token", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(STATUS_CODES.OK).json({
                status: "success",
                data: { message: "Logged out successfully" },
            });
        } catch (error) {
            next(error);
        }
    }

    async createOrder(req: Req, res: Res, next: Next) {
        try {
            const options = {
                amount: req.body.amount * 100, // amount in the smallest currency unit
                currency: "INR",
                receipt: "order_rcptid_11",
            };
            const order = await this.razorpay.orders.create(options);
            res.status(STATUS_CODES.OK).json(order);
        } catch (error) {
            next(error);
        }
    }
}
