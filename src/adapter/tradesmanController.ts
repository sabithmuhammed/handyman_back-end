import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import TradesmanUsecase from "../use_case/tradesmanUsecase";
import { IFile } from "../infrastructure/middlewares/multer";
import Cloudinary from "../infrastructure/utils/cloudinary";
import FileOperations from "../infrastructure/utils/fileOperations";
import PostUsecase from "../use_case/postUsecase";
import { REFRESH_TOKEN_MAX_AGE } from "../infrastructure/constants/constants";
import BookingUsecase from "../use_case/bookingUsecase";

export default class TradesmanController {
    constructor(
        private tradesmanUsecase: TradesmanUsecase,
        private cloudinary: Cloudinary,
        private fileOperations: FileOperations
    ) {}

    async register(req: Req, res: Res, next: Next) {
        try {
            const { name, category, experience, latitude, longitude } =
                req.body;
            const userId = (req as any)?.user;
            const images = req.files as IFile[];

            const profile = await this.cloudinary.saveToCloudinary(images[0]);
            const idProof = await this.cloudinary.saveToCloudinary(images[1]);

            const tradesman = await this.tradesmanUsecase.saveTradesman({
                name,
                userId,
                category,
                experience,
                location: {
                    coordinates: [longitude, latitude],
                    type: "Point",
                },
                profile,
                idProof,
            });

            //deleting images from directory after uploading to cloud
            await this.fileOperations.deleteFile(
                images.map(({ path }) => path)
            );

            res.status(STATUS_CODES.OK).json("Registered Successfully");
        } catch (error) {
            next(error);
        }
    }

    async tradesmanExistCheck(req: Req, res: Res, next: Next) {
        try {
            const userId = (req as any)?.user;
            const tradesman = await this.tradesmanUsecase.checkExistByUserId(
                userId
            );

            if (tradesman.refreshToken) {
                res.cookie("refresh_token", tradesman.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite:
                        process.env.NODE_ENV !== "development"
                            ? "none"
                            : "strict",
                    maxAge: REFRESH_TOKEN_MAX_AGE,
                });
            }

            res.status(tradesman.status).json(tradesman.data);
        } catch (error) {
            next(error);
        }
    }

    async getProfileMinimum(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = req.params.tradesmanId;
            const result = await this.tradesmanUsecase.getProfileMinimum(
                tradesmanId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getProfileFull(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;

            const result = await this.tradesmanUsecase.getProfileFull(
                tradesmanId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async updateWorkingTime(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { workingDays, slotSize, bufferTime } = req.body;
            const result = await this.tradesmanUsecase.updateWorkingTIme(
                tradesmanId,
                workingDays,
                slotSize,
                bufferTime
            );

            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async addNewService(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { service } = req.body;
            const result = await this.tradesmanUsecase.addService(
                tradesmanId,
                service
            );

            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async deleteService(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { serviceId } = req.params;
            const result = await this.tradesmanUsecase.deleteService(
                tradesmanId,
                serviceId
            );

            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async updateService(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { serviceId } = req.params;
            const { service } = req.body;
            const result = await this.tradesmanUsecase.updateService(
                tradesmanId,
                serviceId,
                service
            );

            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async addLeave(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { leaves, reason } = req.body;
            const result = await this.tradesmanUsecase.addLeave(
                tradesmanId,
                leaves.map((date: string) => ({ date, reason }))
            );

            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async removeLeave(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { date } = req.params;
            const result = await this.tradesmanUsecase.removeLeave(
                tradesmanId,
                date
            );

            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
}
