import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import TradesmanUsecase from "../use_case/tradesmanUsecase";
import { IFile } from "../infrastructure/middlewares/multer";
import Cloudinary from "../infrastructure/utils/cloudinary";
import FileOperations from "../infrastructure/utils/fileOperations";
import PostUsecase from "../use_case/postUsecase";
import { REFRESH_TOKEN_MAX_AGE } from "../infrastructure/constants/constants";
import { ConfigurationType } from "../use_case/interface/ITradesmanRepository";

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

    async updateConfiguration(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const {
                startingTime,
                endingTime,
                bufferTime,
                services,
                slotSize,
                workingDays,
            }: ConfigurationType = req.body;
            let hasError = false;
            if (startingTime >= endingTime) {
                hasError = true;
            }
            if (workingDays.every((day) => !day)) {
                hasError = true;
            }
            if (Number(slotSize) < 0.5) {
                hasError = true;
            }
            const allFilled = services.every(
                (item) => item.description && item.amount && item.slots
            );
            if (!allFilled) {
                hasError = true;
            }
            if (hasError) {
                throw new Error("ValidationError");
            }

            const result = await this.tradesmanUsecase.updateConfiguration(
                tradesmanId,
                {
                    startingTime,
                    endingTime,
                    bufferTime:Number(bufferTime),
                    services,
                    slotSize:Number(slotSize),
                    workingDays,
                }
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
}
