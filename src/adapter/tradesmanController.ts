import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import TradesmanUsecase from "../use_case/tradesmanUsecase";
import { IFile } from "../infrastructure/middlewares/multer";
import Cloudinary from "../infrastructure/utils/cloudinary";
import FileOperations from "../infrastructure/utils/fileOperations";
import PostUsecase from "../use_case/postUsecase";
import { REFRESH_TOKEN_MAX_AGE } from "../infrastructure/constants/constants";
import { NextFunction } from "express";

export default class TradesmanController {
    constructor(
        private tradesmanUsecase: TradesmanUsecase,
        private jwtCreate: JwtCreate,
        private cloudinary: Cloudinary,
        private fileOperations: FileOperations,
        private postUsecase: PostUsecase
    ) {}

    async register(req: Req, res: Res, next: Next) {
        try {
            const {
                name,
                skills,
                experience,
                wageAmount,
                wageType,
                latitude,
                longitude,
            } = req.body;
            const userId = (req as any)?.user;
            const images = req.files as IFile[];

            const profile = await this.cloudinary.saveToCloudinary(images[0]);
            const idProof = await this.cloudinary.saveToCloudinary(images[1]);

            const tradesman = await this.tradesmanUsecase.saveTradesman({
                name,
                userId,
                skills: skills.split(","),
                experience,
                wage: {
                    amount: wageAmount,
                    type: wageType,
                },
                location: {
                    coordinates: [latitude, longitude],
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

    async getPost(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const posts = await this.postUsecase.getPosts(tradesmanId);
            res.status(posts.status).json(posts.data);
        } catch (error) {
            next(error);
        }
    }

    async getPostsById(req: Req, res: Res, next: NextFunction) {
        try {
            const { tradesmanId } = req.params;
            const posts = await this.postUsecase.getPosts(tradesmanId);
            console.log(posts,tradesmanId);
            
            res.status(posts.status).json(posts.data);
        } catch (error) {
            next(error);
        }
    }

    async addPost(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            let { text = "" } = req.body;
            const images = req.files as IFile[];
            let image = "";
            if (images) {
                image = await this.cloudinary.saveToCloudinary(images[0]);
            }
            const post = await this.postUsecase.addNewPost({
                text: text,
                image: image,
                date: new Date(),
                tradesmanId,
            });
            res.status(post.status).json(post.data);
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
}
