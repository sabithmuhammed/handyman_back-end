import Booking from "../../domain/booking";
import BookingModel from "../database/bookinModel";
import IBookingRepository from "../../use_case/interface/IBookingRepository";
import { ObjectId } from "mongodb";
import UserModel from "../database/userModel";
import InvoiceModel from "../database/invoiceModel";

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

    async checkAvailability(tradesmanId: string, date: Date): Promise<boolean> {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const result = await BookingModel.find({
            tradesmanId,
            scheduledDate: {
                $elemMatch: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            },
        });

        return result.length !== 0;
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

    async getScheduledBooking(tradesmanId: string): Promise<Booking[]> {
        // const result = await BookingModel.find({
        //     status: {
        //         $nin: ["canceled", "booked"],
        //     },
        // }).populate("userId", "name profile");

        const result = await BookingModel.find({ status: "booked" }).sort({
            bookingDate: -1,
        });
        await UserModel.populate(result, {
            path: "userId",
            select: { name: 1, profile: 1 },
        });

        return result;
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

    async getCompletedBookings(tradesmanId: string): Promise<Booking[]> {
        const bookings = await BookingModel.find({
            tradesmanId,
            status: "completed",
        }).populate({
            path: "userId",
            select: "name profile",
        });
        return bookings;
    }
    async getAllUserBookings(userId: string): Promise<Booking[]> {
        const bookings = await BookingModel.find({ userId })
            .sort({
                _id: -1,
            })
            .populate({
                path: "tradesmanId",
                select: "name profile",
            })
            .exec();
        await InvoiceModel.populate(bookings, {
            path: "invoice",
        });

        return bookings;
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
}
