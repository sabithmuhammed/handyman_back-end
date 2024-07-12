import Tradesman from "../../domain/tradesman";
import TradesmanModel from "../database/tradesmanModel";
import ITradesmanRepository, {
    ConfigurationType,
    FilterType,
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
    async getAllPendingTradesmen(): Promise<Tradesman[] | null> {
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

    async getAllTradesmanWithFilter(
        page: number | undefined,
        pageSize: number | undefined,
        filters: FilterType
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
            skills: { $regex: ".*" + filters.category + ".*", $options: "i" },
        });

        tradesmen = await TradesmanModel.find({
            verificationStatus: "verified",
            category: { $regex: ".*" + filters.category + ".*", $options: "i" },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: filters.coordinates,
                    },
                    $maxDistance: 10000,
                },
            },
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

    async getUniqueSkills(): Promise<string[]> {
        const result = await TradesmanModel.aggregate([
            { $group: { _id: null, uniqueSkills: { $addToSet: "$category" } } },
            {
                $project: {
                    uniqueSkills: {
                        $map: {
                            input: "$uniqueSkills",
                            as: "skill",
                            in: { $toString: "$$skill" },
                        },
                    },
                },
            },
        ]);
        if (result[0]) {
            return result[0].uniqueSkills;
        }
        return [];
    }

    async getAllTradesman(
        page: number | undefined,
        pageSize: number | undefined,
        filters: { category: string }
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
            category: { $regex: ".*" + filters.category + ".*", $options: "i" },
        });

        tradesmen = await TradesmanModel.find({
            verificationStatus: "verified",
            skills: { $regex: ".*" + filters.category + ".*", $options: "i" },
        })
            .skip(offset)
            .limit(pageSize ? Number(pageSize) : 10);

        return {
            tradesmen,
            totalCount,
            page: page ? Number(page) : 1,
        };
    }
    async getProfileFull(tradesmanId: string): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findById(tradesmanId);
        return tradesman;
    }
    async updateConfiguration(
        tradesmanId: string,
        config: ConfigurationType
    ): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmanId,
            {
                $set: {
                    configuration: config,
                },
            },
            { new: true }
        );
        return tradesman
    }
}
