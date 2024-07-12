import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import TradesmanUsecase from "../use_case/tradesmanUsecase";
import SendMail from "../infrastructure/utils/sendMail";
import UserUsecase from "../use_case/userUsecase";

export default class AdminController {
    constructor(
        private tradesmanUsecase: TradesmanUsecase,
        private userUsecase: UserUsecase,
        private sendMail: SendMail
    ) {}

    async getPending(req: Req, res: Res, next: Next) {
        try {
            const tradesmen =
                await this.tradesmanUsecase.getPendingVerifications();
            res.status(tradesmen.status).json(tradesmen.data);
        } catch (error) {
            next(error);
        }
    }

    async verifyTradesman(req: Req, res: Res, next: Next) {
        try {
            const { tradesmanId } = req.body;
            const tradesman =
                await this.tradesmanUsecase.changeVerificationStatus(
                    tradesmanId,
                    "verified"
                );
            if (tradesman) {
                await this.userUsecase.changeUserToTradesman(
                    tradesman.data.userId as string
                );
                const user = await this.userUsecase.getUserById(
                    tradesman.data.userId as string
                );
                if (typeof user.data !== "string") {
                    this.sendMail.sendVerifyMail(
                        user.data?.email as string,
                        tradesman.data.name
                    );
                }
                return res.status(tradesman.status).json(tradesman.data);
            }
            res.status(STATUS_CODES.NOT_FOUND).json("No tradesman found.");
        } catch (error) {
            next(error);
        }
    }

    async rejectTradesman(req: Req, res: Res, next: Next) {
        try {
            const { tradesmanId } = req.body;
            const tradesman =
                await this.tradesmanUsecase.changeVerificationStatus(
                    tradesmanId,
                    "rejected"
                );
            if (tradesman) {
                const user = await this.userUsecase.getUserById(
                    tradesman.data.userId as string
                );
                if (typeof user.data !== "string") {
                    this.sendMail.sendRejectMail(
                        user.data?.email as string,
                        tradesman.data.name
                    );
                }
                res.status(tradesman.status).json(tradesman.data);
            }
            res.status(STATUS_CODES.NOT_FOUND).json("No tradesman found.");
        } catch (error) {
            next(error);
        }
    }

    async getTradesmen(req: Req, res: Res, next: Next) {
        try {
            const page = req.query.page as string | undefined;
            const pageSize = req.query.pageSize as string | undefined;
            // const tradesman = await this.tradesmanUsecase.getTradesmen(
            //     page,
            //     pageSize
            // );
            // return res.status(tradesman.status).json(tradesman.data);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req: Req, res: Res, next: Next) {
        try {
            const page = req.query.page as string | undefined;
            const pageSize = req.query.pageSize as string | undefined;

            const tradesman = await this.userUsecase.getUsers(page, pageSize);
            return res.status(tradesman.status).json(tradesman.data);
        } catch (error) {
            next(error);
        }
    }

    async userBlock(req: Req, res: Res, next: Next) {
        try {
            const { userId } = req.body;
            const user = await this.userUsecase.toggleBlock(userId, true);
            if (user) {
                return res.status(user.status).json(user.data);
            }
            return res.status(STATUS_CODES.NOT_FOUND).json("User not found");
        } catch (error) {
            next(error);
        }
    }
    async userUnblock(req: Req, res: Res, next: Next) {
        try {
            const { userId } = req.body;
            const user = await this.userUsecase.toggleBlock(userId, false);
            if (user) {
                return res.status(user.status).json(user.data);
            }
            return res.status(STATUS_CODES.NOT_FOUND).json("User not found");
        } catch (error) {
            next(error);
        }
    }
    async tradesmanBlock(req: Req, res: Res, next: Next) {
        try {
            const { tradesmanId } = req.body;
            const tradesman = await this.tradesmanUsecase.toggleBlock(
                tradesmanId,
                true
            );
            if (tradesman) {
                return res.status(tradesman.status).json(tradesman.data);
            }
            return res
                .status(STATUS_CODES.NOT_FOUND)
                .json("Tradesman not found");
        } catch (error) {
            next(error);
        }
    }
    async tradesmanUnblock(req: Req, res: Res, next: Next) {
        try {
            const { tradesmanId } = req.body;
            const tradesman = await this.tradesmanUsecase.toggleBlock(
                tradesmanId,
                false
            );
            if (tradesman) {
                return res.status(tradesman.status).json(tradesman.data);
            }
            return res
                .status(STATUS_CODES.NOT_FOUND)
                .json("Tradesman not found");
        } catch (error) {
            next(error);
        }
    }
}
