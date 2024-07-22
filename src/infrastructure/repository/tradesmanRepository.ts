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
        const offset = (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
        const limit = pageSize ? Number(pageSize) : 10;
    
        const selectedDate = filters.date ? new Date(filters.date).toISOString().split("T")[0] : null;
        const dayOfWeek = selectedDate ? (new Date(selectedDate).getUTCDay() + 1) % 7 : null; // Get day of week (0-6), with Sunday as 0
    
        const pipeline: any[] = [
            // Stage 1: Filter tradesmen based on working days and other filters
            {
                $match: {
                    verificationStatus: "verified",
                    ...(filters.category && { category: { $regex: ".*" + filters.category + ".*", $options: "i" } }),
                    ...(filters.coordinates && filters.coordinates.length === 2 && {
                        location: {
                            $geoWithin: {
                                $centerSphere: [filters.coordinates, 10000 / 6378100] // 10000 meters in radians
                            }
                        }
                    }),
                    ...(dayOfWeek !== null && {
                        [`configuration.workingDays.${dayOfWeek}`]: true
                    })
                }
            },
            // Stage 2: Add fields to calculate total available slots
            {
                $addFields: {
                    startingDateTime: {
                        $dateFromString: {
                            dateString: { $concat: [selectedDate, "T", "$configuration.startingTime", ":00.000Z"] }
                        }
                    },
                    endingDateTime: {
                        $dateFromString: {
                            dateString: { $concat: [selectedDate, "T", "$configuration.endingTime", ":00.000Z"] }
                        }
                    },
                    slotDurationMillis: { $multiply: ["$configuration.slotSize", 60 * 60 * 1000] }, // Slot size in milliseconds
                    bufferTimeMillis: { $multiply: ["$configuration.bufferTime", 60 * 1000] } // Buffer time in milliseconds
                }
            },
            // Stage 3: Calculate the total number of slots
            {
                $addFields: {
                    totalAvailableSlots: {
                        $floor: {
                            $divide: [
                                {
                                    $subtract: [
                                        { $toLong: "$endingDateTime" },
                                        { $toLong: "$startingDateTime" }
                                    ]
                                },
                                {
                                    $add: [
                                        "$slotDurationMillis",
                                        "$bufferTimeMillis"
                                    ]
                                }
                            ]
                        }
                    }
                }
            },
            // Stage 4: Lookup bookings and count the slots for each tradesman
            {
                $lookup: {
                    from: 'bookings',
                    let: { tradesmanId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$tradesmanId', '$$tradesmanId'] },
                                        { $eq: [{ $substr: ['$bookingDate', 0, 10] }, selectedDate] }
                                    ]
                                }
                            }
                        },
                        {
                            $addFields: {
                                numberOfSlotsBooked: { $size: "$slots" }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalBookedSlots: { $sum: "$numberOfSlotsBooked" }
                            }
                        }
                    ],
                    as: 'bookings'
                }
            },
            // Stage 5: Add field for total booked slots and filter tradesmen
            {
                $addFields: {
                    totalBookedSlots: {
                        $ifNull: [{ $arrayElemAt: ['$bookings.totalBookedSlots', 0] }, 0]
                    }
                }
            },
            {
                $match: {
                    $expr: {
                        $lt: ['$totalBookedSlots', '$totalAvailableSlots']
                    }
                }
            },
            // Stage 6: Project the necessary fields
            {
                $project: {
                    _id: 1,
                    name: 1,
                    profile: 1,
                    idProof: 1,
                    userId: 1,
                    experience: 1,
                    category: 1,
                    location: 1,
                    configuration: 1,
                    verificationStatus: 1,
                    isBlocked: 1,
                    rating: 1
                }
            },
            // Stage 7: Pagination
            { $skip: offset },
            { $limit: limit }
        ];
    
        // Execute the aggregation pipeline
        const tradesmen = await TradesmanModel.aggregate(pipeline);
    
        // Get the total count of tradesmen matching the initial filters
        const totalCount = await TradesmanModel.countDocuments({
            verificationStatus: "verified",
            ...(filters.category && { category: { $regex: ".*" + filters.category + ".*", $options: "i" } }),
            ...(filters.coordinates && filters.coordinates.length === 2 && {
                location: {
                    $geoWithin: {
                        $centerSphere: [filters.coordinates, 10000 / 6378100] // 10000 meters in radians
                    }
                }
            }),
            ...(dayOfWeek !== null && {
                [`configuration.workingDays.${dayOfWeek}`]: true
            })
        });
    
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
