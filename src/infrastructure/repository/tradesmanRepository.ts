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

    // async getAllTradesmanWithFilter(
    //     page: number | undefined,
    //     pageSize: number | undefined,
    //     filters: FilterType
    // ): Promise<{
    //     tradesmen: Tradesman[] | null;
    //     totalCount: number;
    //     page: number;
    // }> {
    //     let tradesmen: Tradesman[] | null = null;
    //     const offset =
    //         (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
    //     const totalCount = await TradesmanModel.countDocuments({
    //         verificationStatus: "verified",
    //         skills: { $regex: ".*" + filters.category + ".*", $options: "i" },
    //     });

    //     tradesmen = await TradesmanModel.find({
    //         verificationStatus: "verified",
    //         category: { $regex: ".*" + filters.category + ".*", $options: "i" },
    //         location: {
    //             $near: {
    //                 $geometry: {
    //                     type: "Point",
    //                     coordinates: filters.coordinates,
    //                 },
    //                 $maxDistance: 10000,
    //             },
    //         },
    //     })
    //         .skip(offset)
    //         .limit(pageSize ? Number(pageSize) : 10);

    //     return {
    //         tradesmen,
    //         totalCount,
    //         page: page ? Number(page) : 1,
    //     };
    // }

    async getAllTradesmanWithFilter(
        page: number | undefined,
        pageSize: number | undefined,
        filters: FilterType
    ): Promise<{
        tradesmen: Tradesman[] | null;
        totalCount: number;
        page: number;
    }> {
        const offset =
            (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
        const limit = pageSize ? Number(pageSize) : 10;

        const selectedDate = filters.date
            ? new Date(filters.date).toISOString().split("T")[0]
            : null;
        const dayOfWeek = selectedDate
            ? (new Date(selectedDate).getUTCDay() + 1) % 7
            : null; // Get day of week (0-6), with Sunday as 0

        // verificationStatus: "verified",
        //             ...(filters.category && { category: { $regex: ".*" + filters.category + ".*", $options: "i" } }),
        //             ...(filters.coordinates && filters.coordinates.length === 2 && {
        //                 location: {
        //                     $geoWithin: {
        //                         $centerSphere: [filters.coordinates, 10000 / 6378100] // 10000 meters in radians
        //                     }
        //                 }
        //             }),

        let pipeline: any[] = [
            {
                $match: {
                    category: {
                        $regex: ".*" + filters.category + ".*",
                        $options: "i",
                    },
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                filters.coordinates,
                                10000 / 6378100,
                            ], // 10000 meters in radians
                        },
                    },
                },
            },
            { $skip: offset },
            { $limit: limit },
        ];
        if (filters.date) {
            const date = new Date(filters.date);
            const dayOfWeek = date.getDay();
            const startDate = new Date(filters.date);
            const endDate = new Date(filters.date);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            
            pipeline = [
                {
                    $match: {
                        category: {
                            $regex: ".*" + filters.category + ".*",
                            $options: "i",
                        },
                        location: {
                            $geoWithin: {
                                $centerSphere: [
                                    filters.coordinates,
                                    10000 / 6378100,
                                ], // 10000 meters in radians
                            },
                        },
                        $expr: {
                            $eq: [
                                {
                                    $arrayElemAt: [
                                        "$configuration.workingDays",
                                        dayOfWeek,
                                    ],
                                },
                                true,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        name: 1,
                        category: 1,
                        experience: 1,
                        location: 1,
                        "configuration.startingTime": 1,
                        "configuration.endingTime": 1,
                        "configuration.bufferTime": 1,
                        "configuration.slotSize": 1,
                        "configuration.workingDays": 1,
                        verificationStatus: 1,
                        isBlocked: 1,
                        rating: 1,
                        // Convert times to minutes
                        startMinutes: {
                            $sum: [
                                {
                                    $multiply: [
                                        {
                                            $toInt: {
                                                $substr: [
                                                    "$configuration.startingTime",
                                                    0,
                                                    2,
                                                ],
                                            },
                                        },
                                        60,
                                    ],
                                },
                                {
                                    $toInt: {
                                        $substr: [
                                            "$configuration.startingTime",
                                            3,
                                            2,
                                        ],
                                    },
                                },
                            ],
                        },
                        endMinutes: {
                            $sum: [
                                {
                                    $multiply: [
                                        {
                                            $toInt: {
                                                $substr: [
                                                    "$configuration.endingTime",
                                                    0,
                                                    2,
                                                ],
                                            },
                                        },
                                        60,
                                    ],
                                },
                                {
                                    $toInt: {
                                        $substr: [
                                            "$configuration.endingTime",
                                            3,
                                            2,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $addFields: {
                        totalWorkingMinutes: {
                            $subtract: ["$endMinutes", "$startMinutes"],
                        },
                        workingDaysCount: {
                            $size: {
                                $filter: {
                                    input: "$configuration.workingDays",
                                    as: "day",
                                    cond: { $eq: ["$$day", true] },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        adjustedWorkingMinutes: {
                            $subtract: [
                                "$totalWorkingMinutes",
                                "$configuration.bufferTime",
                            ],
                        },
                        slotSizeMinutes: {
                            $multiply: ["$configuration.slotSize", 60],
                        },
                    },
                },
                {
                    $addFields: {
                        slots: {
                            $floor: {
                                $divide: [
                                    "$adjustedWorkingMinutes",
                                    "$slotSizeMinutes",
                                ],
                            },
                        },
                    },
                },
                {
                    $project: {
                        startMinutes: 0,
                        endMinutes: 0,
                        totalWorkingMinutes: 0,
                        adjustedWorkingMinutes: 0,
                        slotSizeMinutes: 0,
                        workingDaysCount: 0,
                    },
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
                                            {
                                                $eq: [
                                                    "$tradesmanId",
                                                    "$$tradesmanId",
                                                ],
                                            },
                                            { $gte: ["$bookingDate", startDate] }, // Replace with the date you want to filter by
                                            { $lte: ["$bookingDate", endDate] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "bookings",
                    },
                },
                {
                    $addFields: { slots: { $subtract: ["$slots", 1] } },
                },
                {
                    $addFields: {
                        bookingCount: { $size: "$bookings" }, // Add a field to store the size of the bookings array
                    },
                },
                {
                    $match: {
                        $expr: {
                            $lt: ["$bookingCount", "$slots"], // Compare the size of bookings with the slots field
                        },
                    },
                },
                {
                    $project: {
                        bookingCount: 0,
                        slots: 0,
                        bookings: 0,
                    },
                },
                { $skip: offset },
                { $limit: limit },
            ];
        }

        // Execute the aggregation pipeline
        const tradesmen = await TradesmanModel.aggregate(pipeline);

        // Get the total count of tradesmen matching the initial filters
        const totalCount = await TradesmanModel.countDocuments({});
        console.log(tradesmen, "hjghghjkjghjghghgh");

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
        return tradesman;
    }
}
