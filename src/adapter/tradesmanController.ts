import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import TradesmanUsecase from "../use_case/tradesmanUsecase";
import { IFile } from "../infrastructure/middlewares/multer";
import Cloudinary from "../infrastructure/utils/cloudinary";
import FileOperations from "../infrastructure/utils/fileOperations";

export default class TradesmanController {
    constructor(
        private tradesmanUsecase: TradesmanUsecase,
        private jwtCreate: JwtCreate,
        private cloudinary: Cloudinary,
        private fileOperations: FileOperations
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

            
            const profile = await this.cloudinary.saveToCloudinary(images[0])
            const idProof = await this.cloudinary.saveToCloudinary(images[1])

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
                idProof
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
            res.status(tradesman.status).json(tradesman.data);
        } catch (error) {
            next(error);
        }
    }
}
