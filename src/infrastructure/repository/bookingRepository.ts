import Booking from "../../domain/booking";
import BookingModel from "../database/bookinModel";
import IBookingRepository from "../../use_case/interface/IBookingRepository";
import { ObjectId } from "mongodb";
import UserModel from "../database/userModel";
import InvoiceModel from "../database/invoiceModel";
import mongoose from "mongoose";

export default class BookingRepository implements IBookingRepository {
    async createNewBooking(booking: Booking): Promise<Booking> {
        const newBooking = new BookingModel(booking);
        await newBooking.save();
        return newBooking;
    }
    async getAllPendingBookings(tradesmanId: string): Promise<Booking[]> {
        const bookings = await BookingModel.find({
            tradesmanId,
            status: "booked",
        }).populate("userId", "name profile");
        return bookings;
    }
    async scheduleBooking(
        bookingId: string,
        scheduledDate: Date[]
    ): Promise<Booking | null> {
        const booking = await BookingModel.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    scheduledDate,
                    status: "scheduled",
                },
            },
            { new: true }
        );
        return booking;
    }

    async getScheduledDates(
        tradesmanId: string,
        startingDate: Date
    ): Promise<Date[]> {
        const result = await BookingModel.aggregate([
            {
                $match: {
                    tradesmanId: new ObjectId(tradesmanId),
                },
            },
            { $unwind: { path: "$scheduledDate" } },
            {
                $match: {
                    scheduledDate: {
                        $gt: startingDate,
                    },
                },
            },
            { $group: { _id: null, schedules: { $push: "$scheduledDate" } } },
            { $project: { _id: 0 } },
        ]);
        if (result[0]) {
            return result[0].schedules;
        }
        return [];
    }

    async checkAvailability(
        tradesmanId: string,
        date: Date,
        slots: string[]
    ): Promise<boolean> {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        // Query to find if there's a booking for the tradesman on the specified date where any of the slots overlap
        const result = await BookingModel.findOne({
            tradesmanId,
            bookingDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            slots: { $in: slots }, // Check if any of the slots in the array are already booked
        });

        // If result is found, at least one of the slots is unavailable
        return result === null;
    }

    async rejectBooking(bookingId: string): Promise<Booking | null> {
        const result = await BookingModel.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    status: "canceled",
                },
            },
            { new: true }
        );
        return result;
    }

    async getScheduledBooking(
        tradesmanId: string,
        date: string,
        page: number | undefined,
        pageSize: number | undefined
    ): Promise<{
        bookings: Booking[];
        totalCount: number;
        page: number;
    }> {
        let query: object = {
            tradesmanId,
            status: "booked",
        };

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            query = {
                tradesmanId,
                status: "booked",
                $and: [
                    {
                        bookingDate: {
                            $gte: startDate,
                            $lte: endDate,
                        },
                    },
                ],
            };
        }

        const offset =
            (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);

        const totalCount = await BookingModel.countDocuments(query);

        const bookings = await BookingModel.find(query)
            .sort({ bookingDate: -1 })
            .skip(offset)
            .limit(pageSize ? Number(pageSize) : 10);

        await UserModel.populate(bookings, {
            path: "userId",
            select: { name: 1, profile: 1 },
        });

        return {
            bookings,
            totalCount,
            page: page ? Number(page) : 1,
        };
    }

    async changeToCompleted(bookingId: string): Promise<Booking | null> {
        const booking = await BookingModel.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    status: "completed",
                },
            },
            { new: true }
        );
        return booking;
    }

    async getCompletedBookings(
        tradesmanId: string,
        date: string,
        page: number | undefined,
        pageSize: number | undefined
    ): Promise<{
        bookings: Booking[];
        totalCount: number;
        page: number;
    }> {
        let query: object = {
            tradesmanId,
            status: "completed",
        };

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            query = {
                tradesmanId,
                status: "completed",
                $and: [
                    {
                        bookingDate: {
                            $gte: startDate,
                            $lte: endDate,
                        },
                    },
                ],
            };
        }

        const offset =
            (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);

        const totalCount = await BookingModel.countDocuments(query);

        const bookings = await BookingModel.find(query)
            .sort({ bookingDate: -1 })
            .skip(offset)
            .limit(pageSize ? Number(pageSize) : 10)
            .populate({
                path: "userId",
                select: "name profile",
            });

        return {
            bookings,
            totalCount,
            page: page ? Number(page) : 1,
        };
    }

    async getAllUserBookings(
        userId: string,
        limit: number,
        page: number
    ): Promise<{ data: Booking[]; hasMore: boolean }> {
        const skip = (page - 1) * limit;

        const bookings = await BookingModel.find({ userId })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "tradesmanId",
                select: "name profile",
            })
            .exec();

        await InvoiceModel.populate(bookings, {
            path: "invoice",
        });

        const totalBookingsCount = await BookingModel.countDocuments({
            userId,
        });
        const hasMore = skip + limit < totalBookingsCount;

        return {
            data: bookings,
            hasMore,
        };
    }

    async addInvoice(id: string, invoice: string): Promise<Booking | null> {
        const booking = await BookingModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    invoice,
                },
            },
            { new: true }
        );

        return booking;
    }

    async getUnavailableSlots(
        tradesmanId: string,
        date: string
    ): Promise<any[]> {
        const dateToCheck = new Date(date);
        const result = await BookingModel.aggregate([
            {
                // Match documents where bookingDate is the same as the dateToCheck and tradesmanId matches
                $match: {
                    tradesmanId: new ObjectId(tradesmanId),
                    status: "booked",
                    bookingDate: {
                        $gte: new Date(dateToCheck.setUTCHours(0, 0, 0, 0)),
                        $lt: new Date(dateToCheck.setUTCHours(24, 0, 0, 0)),
                    },
                },
            },
            {
                // Project only the necessary fields
                $project: {
                    slots: 1,
                },
            },
            {
                // Unwind the slots array
                $unwind: "$slots",
            },
            // {
            //   // Transform each slot to the desired format
            //   $project: {
            //     slot: {
            //       $map: {
            //         input: { $split: ['$slots', ' - '] },
            //         as: 'time',
            //         in: '$$time'
            //       }
            //     }
            //   }
            // },
            {
                // Group the transformed slots into an array
                $group: {
                    _id: null,
                    unavailableSlots: { $push: "$slots" },
                },
            },
            {
                // Project the final result without the _id field
                $project: {
                    _id: 0,
                    unavailableSlots: 1,
                },
            },
        ]);
        console.log(result);
        return result;
    }
    async changePaymentStatus(bookingId: string): Promise<Booking | null> {
        const booking = await BookingModel.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    paymentDetails: {
                        status: "success",
                        date: new Date(),
                    },
                },
            },
            { new: true }
        );
        return booking;
    }

    async getBookingsCount(tradesmanId: string): Promise<any> {
        const bookingsCount = await BookingModel.aggregate([
            {
                $match: {
                    tradesmanId: new ObjectId(tradesmanId),
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        return bookingsCount;
    }
    async getServiceAndCount(
        tradesmanId: string,
        filter: string
    ): Promise<any> {
        const currentDate = new Date();
        let startDate;

        if (filter === "today") {
            startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        } else if (filter === "week") {
            startDate = new Date(
                currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay()
                )
            );
            startDate.setHours(0, 0, 0, 0);
        } else if (filter === "month") {
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            );
        } else if (filter === "year") {
            startDate = new Date(currentDate.getFullYear(), 0, 1);
        } else {
            throw new Error("Invalid period specified");
        }

        let pipeline = [
            {
                $match: {
                    tradesmanId: new ObjectId(tradesmanId),
                    "paymentDetails.status": "success",
                    bookingDate: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: "$service",
                    count: { $sum: 1 },
                },
            },
        ];

        const data = await BookingModel.aggregate(pipeline).exec();

        return data;
    }

    async getPaymentAggregation(
        tradesmanId: string,
        filter: string
    ): Promise<any> {
        const currentDate = new Date();
        let startDate: Date;
        let groupBy: any;

        if (filter === "today") {
            startDate = new Date(currentDate.setHours(0, 0, 0, 0));
            groupBy = {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$paymentDetails.date",
                },
            };
        } else if (filter === "week") {
            startDate = new Date(
                currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay()
                )
            );
            startDate.setHours(0, 0, 0, 0);
            groupBy = {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$paymentDetails.date",
                },
            };
        } else if (filter === "month") {
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            );
            groupBy = {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$paymentDetails.date",
                },
            };
        } else if (filter === "year") {
            startDate = new Date(currentDate.getFullYear(), 0, 1);
            groupBy = {
                $dateToString: {
                    format: "%Y-%m",
                    date: "$paymentDetails.date",
                },
            };
        } else {
            throw new Error("Invalid period specified");
        }

        const pipeline: mongoose.PipelineStage[] = [
            {
                $match: {
                    "paymentDetails.status": "success",
                    "paymentDetails.date": { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: groupBy,
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $sort: { _id: 1 as 1 | -1 },
            },
        ];

        return await BookingModel.aggregate(pipeline).exec();
    }

    async checkBookingForDate(
        tradesmanId: string,
        date: string
    ): Promise<number> {
        const startDate = new Date(date);
        const endDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const query = {
            tradesmanId,
            $and: [
                {
                    bookingDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            ],
        };

        const count = await BookingModel.find(query).countDocuments();

        return count;
    }
}
