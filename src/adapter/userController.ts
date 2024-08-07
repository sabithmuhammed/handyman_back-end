import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import UserUsecase from "../use_case/userUsecase";
import User from "../domain/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import SendMail from "../infrastructure/utils/sendMail";
import GenerateOtp from "../infrastructure/utils/generateOtp";
import OtpUsecase from "../use_case/otpUsecase";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ROLES from "../infrastructure/constants/roles";
import { REFRESH_TOKEN_MAX_AGE } from "../infrastructure/constants/constants";
import TradesmanUsecase from "../use_case/tradesmanUsecase";
import { IFile } from "../infrastructure/middlewares/multer";
import Cloudinary from "../infrastructure/utils/cloudinary";
import FileOperations from "../infrastructure/utils/fileOperations";

export default class UserController {
    constructor(
        private userUsecase: UserUsecase,
        private genOtp: GenerateOtp,
        private sendMail: SendMail,
        private otpUsecase: OtpUsecase,
        private tradesmanUsecase: TradesmanUsecase,
        private cloudinary: Cloudinary,
        private fileOperations: FileOperations,
    ) {}

    async signUp(req: Req, res: Res, next: Next) {
        try {
            const user = req.body;
            const userFound = await this.userUsecase.emailExistCheck(
                user.email
            );
            if (!userFound.data) {
                const otp = await this.genOtp.generateOtp(6);
                this.otpUsecase.saveOtp({ email: user.email, otp });
                this.sendMail.sendOtpMail(user.email, user.name, otp);

                res.status(STATUS_CODES.OK).json({ status: "success" });
            } else {
                res.status(STATUS_CODES.CONFLICT).json(
                    "Email Id already in use"
                );
            }
        } catch (error) {
            next(error);
        }
    }

    async signUpVerify(req: Req, res: Res, next: Next) {
        try {
            const { email, name, password, otp } = req.body;

            if (!(await this.otpUsecase.compareOtp({ email, otp })).data) {
                res.status(STATUS_CODES.OK).json({
                    status: "failed",
                    message: "OTP doesn't match",
                });
                return;
            }
            const userData = {
                name,
                email,
                password,
            };
            const newUser = await this.userUsecase.saveUser(userData);
            this.otpUsecase.removeOtp(email);
            res.status(newUser.status).json({
                status: "success",
                data: newUser.data,
            });
        } catch (error) {
            next(error);
        }
    }

    async resentOtp(req: Req, res: Res, next: Next) {
        try {
            const { email, name } = req.body;

            const otp = await this.genOtp.generateOtp(6);
            this.otpUsecase.saveOtp({ email, otp });
            this.sendMail.sendOtpMail(email, name, otp);

            res.status(STATUS_CODES.OK).json({ status: "success" });
        } catch (error) {
            next(error);
        }
    }

    async socialLogin(req: Req, res: Res, next: Next) {
        try {
            const { email, name } = req.body;
            const user = await this.userUsecase.handleSocialLogin(email, name);
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
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Req, res: Res, next: Next) {
        try {
            const { email } = req.body;
            if (email) {
                const userFound = await this.userUsecase.emailExistCheck(email);
                if (userFound.data) {
                    const { email, name } = userFound.data;
                    const otp = await this.genOtp.generateOtp(6);
                    this.otpUsecase.saveOtp({ email, otp });
                    this.sendMail.sendOtpMail(email, name, otp);

                    res.status(STATUS_CODES.OK).json({ name, email });
                } else {
                    res.status(STATUS_CODES.NOT_FOUND).json(
                        "No account found associated with this email."
                    );
                }
            }
            throw new Error("ValidationError");
        } catch (error) {
            next(error);
        }
    }
    async forgotPasswordVerifyOtp(req: Req, res: Res, next: Next) {
        try {
            const { email, otp } = req.body;
            if (!(await this.otpUsecase.compareOtp({ email, otp })).data) {
                res.status(STATUS_CODES.OK).json({
                    status: "failed",
                    message: "OTP doesn't match",
                });
                return;
            }
            res.status(STATUS_CODES.OK).json({ status: "success" });
        } catch (error) {
            next(error);
        }
    }

    async forgotPasswordChange(req: Req, res: Res, next: Next) {
        try {
            const { email, otp, password } = req.body;
            if (!(await this.otpUsecase.compareOtp({ email, otp })).data) {
                throw new Error("UnauthorizedError");
            }
            await this.otpUsecase.removeOtp(email);
            const updateUser = await this.userUsecase.changePassword(
                email,
                password
            );
            const status = updateUser ? "success" : "failed";
            res.status(updateUser.status).json({ status });
        } catch (error) {
            next(error);
        }
    }

    async getTradesmen(req: Req, res: Res, next: Next) {
        try {
            const { page, pageSize, longitude, latitude, category, date } =
                req.query;

            const tradesmen = await this.tradesmanUsecase.getTradesmen(
                Number(page),
                Number(pageSize),
                {
                    category: category as string,
                    date: date ? (date as string) : "",
                    coordinates: [Number(longitude), Number(latitude)],
                }
            );
            res.status(tradesmen.status).json(tradesmen.data);
        } catch (error) {
            next(error);
        }
    }

    async getAllSkills(req: Req, res: Res, next: Next) {
        try {
            const data = await this.tradesmanUsecase.getAllSkills();
            return res.status(data.status).json(data.data);
        } catch (error) {
            next(error);
        }
    }

    async getUserInfo(req: Req, res: Res, next: Next) {
        try {
            const { userId } = req.params;
            const data = await this.userUsecase.getUserById(userId);
            return res.status(data.status).json(data.data);
        } catch (error) {
            next(error);
        }
    }

    async updateUserData(req: Req, res: Res, next: Next) {
        try {
            let { name, profile } = req.body;
            const userId = (req as any)?.user;
            const image = req.file;
            if (image) {
                profile = await this.cloudinary.saveToCloudinary(image);
                await this.fileOperations.deleteFile(image.path);
            }

            const data = await this.userUsecase.updateUserProfile(
                userId,
                name,
                profile
            );
            res.status(data.status).json(data.data);
        } catch (error) {
            next(error);
        }
    }

    async getAllTradesmen(req: Req, res: Res, next: Next) {
        try {
            const { page, pageSize, longitude, category } = req.query;

            const tradesmen = await this.tradesmanUsecase.getAllTradesmen(
                Number(page),
                Number(pageSize),
                {
                    category: category as string,
                }
            );
            res.status(tradesmen.status).json(tradesmen.data);
        } catch (error) {
            next(error);
        }
    }
}
