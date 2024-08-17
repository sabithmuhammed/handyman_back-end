import Tradesman, { Service, WorkingDay } from "../../domain/tradesman";
import TradesmanModel from "../database/tradesmanModel";
import ITradesmanRepository, {
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
        console.log("Filters received:", JSON.stringify(filters, null, 2));
    
        const offset = (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
        const limit = pageSize ? Number(pageSize) : 10;
    
        let pipeline: any[] = [
            {
                $match: {
                    category: filters.category ? {
                        $regex: ".*" + filters.category + ".*",
                        $options: "i",
                    } : { $exists: true },
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                filters.coordinates,
                                10000 / 6378100,
                            ],
                        },
                    },
                },
            },
        ];
    
        if (filters.date) {
            const date = new Date(filters.date);
            console.log("Parsed date:", date);
            const dayOfWeek = date.getUTCDay();
            const startOfDay = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            const endOfDay = new Date(startOfDay);
            endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
    
            pipeline = [
                ...pipeline,
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $arrayElemAt: ["$configuration.workingDays.isWorking", dayOfWeek] }, true] },
                                {
                                    $not: {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$configuration.leaves",
                                                as: "leave",
                                                in: {
                                                    $and: [
                                                        { $gte: ["$$leave.date", startOfDay] },
                                                        { $lt: ["$$leave.date", endOfDay] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        workingHours: { $arrayElemAt: ["$configuration.workingDays", dayOfWeek] },
                        slotSize: "$configuration.slotSize",
                        bufferTime: "$configuration.bufferTime"
                    }
                },
                {
                    $addFields: {
                        startMinutes: {
                            $sum: [
                                { $multiply: [{ $toInt: { $substr: ["$workingHours.start", 0, 2] } }, 60] },
                                { $toInt: { $substr: ["$workingHours.start", 3, 2] } }
                            ]
                        },
                        endMinutes: {
                            $sum: [
                                { $multiply: [{ $toInt: { $substr: ["$workingHours.end", 0, 2] } }, 60] },
                                { $toInt: { $substr: ["$workingHours.end", 3, 2] } }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        totalWorkingMinutes: { $subtract: ["$endMinutes", "$startMinutes"] },
                        slotSizeMinutes: { $multiply: ["$slotSize", 60] }
                    }
                },
                {
                    $addFields: {
                        availableSlots: {
                            $floor: {
                                $divide: [
                                    { $subtract: ["$totalWorkingMinutes", { $multiply: ["$bufferTime", { $subtract: [{ $divide: ["$totalWorkingMinutes", "$slotSizeMinutes"] }, 1] }] }] },
                                    "$slotSizeMinutes"
                                ]
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "bookings",
                        let: { tradesmanId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$tradesmanId", "$$tradesmanId"] },
                                            { $gte: ["$bookingDate", startOfDay] },
                                            { $lt: ["$bookingDate", endOfDay] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "bookings"
                    }
                },
                {
                    $addFields: {
                        bookingCount: { $size: "$bookings" },
                        remainingSlots: { $subtract: ["$availableSlots", { $size: "$bookings" }] }
                    }
                },
                {
                    $match: {
                        $expr: {
                            $gt: ["$remainingSlots", 0]
                        }
                    }
                },
                {
                    $project: {
                        name: 1,
                        profile: 1,
                        experience: 1,
                        category: 1,
                        location: 1,
                        configuration: 1,
                        verificationStatus: 1,
                        isBlocked: 1,
                        availableSlots: 1,
                        bookingCount: 1,
                        remainingSlots: 1
                    }
                }
            ];
        }
    
        // Add pagination stages
        pipeline.push(
            { $skip: offset },
            { $limit: limit }
        );
    
        console.log("Final pipeline:", JSON.stringify(pipeline, null, 2));
    
        // Execute the aggregation pipeline
        const tradesmen = await TradesmanModel.aggregate(pipeline);
        console.log("Tradesmen found:", tradesmen.length);
        console.log("First tradesman:", JSON.stringify(tradesmen[0], null, 2));
    
        // Get the total count of tradesmen matching the filters (without pagination)
        const countPipeline = pipeline.slice(0, -2);  // Remove skip and limit stages
        countPipeline.push({ $count: "totalCount" });
        const countResult = await TradesmanModel.aggregate(countPipeline);
        const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;
    
        console.log("Total count:", totalCount);
    
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
            category: { $regex: ".*" + filters.category + ".*", $options: "i" },
        })
            .skip(offset)
            .limit(pageSize ? Number(pageSize) : 10);
        console.log(tradesmen);

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

    // async updateConfiguration(
    //     tradesmanId: string,
    //     config: ConfigurationType
    // ): Promise<Tradesman | null> {
    //     const tradesman = await TradesmanModel.findByIdAndUpdate(
    //         tradesmanId,
    //         {
    //             $set: {
    //                 configuration: config,
    //             },
    //         },
    //         { new: true }
    //     );
    //     return tradesman;
    // }

    async updateWorkingTime(
        tradesmanId: string,
        workingDays: WorkingDay[],
        slotSize: number,
        bufferTime: number
    ): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmanId,
            {
                $set: {
                    "configuration.workingDays": workingDays,
                    "configuration.slotSize": slotSize,
                    "configuration.bufferTime": bufferTime,
                },
            },
            { new: true }
        );
        return tradesman;
    }

    async addService(
        tradesmanId: string,
        service: Service
    ): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmanId,
            {
                $push: {
                    "configuration.services": service,
                },
            },
            { new: true }
        );
        return tradesman;
    }

    async deleteService(
        tradesmanId: string,
        serviceId: string
    ): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmanId,
            {
                $pull: {
                    "configuration.services": { _id: serviceId },
                },
            },
            { new: true }
        );
        return tradesman;
    }
    async updateService(
        tradesmanId: string,
        serviceId: string,
        service: Service
    ): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findOneAndUpdate(
            { _id: tradesmanId, "configuration.services._id": serviceId },
            {
                $set: {
                    "configuration.services.$": { ...service, _id: serviceId },
                },
            },
            { new: true }
        );
        return tradesman;
    }
    async addLeave(
        tradesmaId: string,
        leaves: { date: string; reason: string }[]
    ): Promise<Tradesman | null> {
        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmaId,
            {
                $addToSet: {
                    "configuration.leaves": { $each: leaves },
                },
            },
            { new: true }
        );
        return tradesman;
    }
    async removeLeave(
        tradesmanId: string,
        date: string
    ): Promise<Tradesman | null> {
        const dateToRemove = new Date(date);

        const tradesman = await TradesmanModel.findByIdAndUpdate(
            tradesmanId,
            {
                $pull: {
                    "configuration.leaves": {
                        date: {
                            $gte: new Date(dateToRemove.setHours(0, 0, 0, 0)),
                            $lt: new Date(
                                dateToRemove.setHours(23, 59, 59, 999)
                            ),
                        },
                    },
                },
            },
            { new: true }
        );
        return tradesman;
    }
}
