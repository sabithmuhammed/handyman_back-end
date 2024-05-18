import Tradesman from "../../domain/tradesman";
import TradesmanModel from "../database/tradesmanModel";
import ITradesmanRepository, {
    VerificationType,
} from "../../use_case/interface/ITradesmanRepository";

export default class TradesmanRepository implements ITradesmanRepository {
    async saveTradesman(tradesman: Tradesman): Promise<Tradesman> {
        const newTradesman = new TradesmanModel(tradesman);
        await newTradesman.save();
        return newTradesman;
    }
    async findByUserId(userId: string): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findOne({ userId });
        return tradesman;
    }
    async getASllPending(): Promise<Tradesman[] | null> {
        const tradesmen = await TradesmanModel.find({
            verificationStatus: "pending",
        });
        return tradesmen;
    }

    async changeVerificationStatus(
        tradesmanId: string,
        status: VerificationType
    ): Promise<Tradesman | null> {
        console.log(status, "hjkhjjk");

        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmanId,
            {
                $set: {
                    verificationStatus: status,
                },
            },
            { new: true }
        );
        return tradesman;
    }

    async getAllTradesman(
        page: string | undefined,
        pageSize: string | undefined
    ): Promise<{
        tradesmen: Tradesman[] | null;
        totalCount: number;
        page: number;
    }> {
        let tradesmen: Tradesman[] | null = null;
        const offset =
            (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
        const totalCount = await TradesmanModel.countDocuments({
            verificationStatus: "verified",
        });

        tradesmen = await TradesmanModel.find({
            verificationStatus: "verified",
        })
            .skip(offset)
            .limit(pageSize ? Number(pageSize) : 10);

        return {
            tradesmen,
            totalCount,
            page: page ? Number(page) : 1,
        };
    }
    async toggleBlock(
        tradesmaId: string,
        status: boolean
    ): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmaId,
            {
                $set: { isBlocked: status },
            },
            { new: true }
        );
        return tradesman;
    }
    async findById(id: string): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findById(id);
        return tradesman;
    }
}
