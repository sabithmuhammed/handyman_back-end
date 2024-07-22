"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookinModel_1 = __importDefault(require("../database/bookinModel"));
const mongodb_1 = require("mongodb");
const userModel_1 = __importDefault(require("../database/userModel"));
const invoiceModel_1 = __importDefault(require("../database/invoiceModel"));
class BookingRepository {
    createNewBooking(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBooking = new bookinModel_1.default(booking);
            yield newBooking.save();
            return newBooking;
        });
    }
    getAllPendingBookings(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookinModel_1.default.find({
                tradesmanId,
                status: "booked",
            }).populate("userId", "name profile");
            return bookings;
        });
    }
    scheduleBooking(bookingId, scheduledDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookinModel_1.default.findByIdAndUpdate(bookingId, {
                $set: {
                    scheduledDate,
                    status: "scheduled",
                },
            }, { new: true });
            return booking;
        });
    }
    getScheduledDates(tradesmanId, startingDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bookinModel_1.default.aggregate([
                {
                    $match: {
                        tradesmanId: new mongodb_1.ObjectId(tradesmanId),
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
        });
    }
    checkAvailability(tradesmanId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            const result = yield bookinModel_1.default.find({
                tradesmanId,
                scheduledDate: {
                    $elemMatch: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                },
            });
            return result.length !== 0;
        });
    }
    rejectBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bookinModel_1.default.findByIdAndUpdate(bookingId, {
                $set: {
                    status: "canceled",
                },
            }, { new: true });
            return result;
        });
    }
    getScheduledBooking(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const result = await BookingModel.find({
            //     status: {
            //         $nin: ["canceled", "booked"],
            //     },
            // }).populate("userId", "name profile");
            const result = yield bookinModel_1.default.find({ status: "booked" }).sort({
                bookingDate: -1,
            });
            yield userModel_1.default.populate(result, {
                path: "userId",
                select: { name: 1, profile: 1 },
            });
            return result;
        });
    }
    changeToCompleted(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookinModel_1.default.findByIdAndUpdate(bookingId, {
                $set: {
                    status: "completed",
                },
            }, { new: true });
            return booking;
        });
    }
    getCompletedBookings(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookinModel_1.default.find({
                tradesmanId,
                status: "completed",
            }).populate({
                path: "userId",
                select: "name profile",
            });
            return bookings;
        });
    }
    getAllUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookinModel_1.default.find({ userId })
                .sort({
                _id: -1,
            })
                .populate({
                path: "tradesmanId",
                select: "name profile",
            })
                .exec();
            yield invoiceModel_1.default.populate(bookings, {
                path: "invoice",
            });
            return bookings;
        });
    }
    addInvoice(id, invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookinModel_1.default.findByIdAndUpdate(id, {
                $set: {
                    invoice,
                },
            }, { new: true });
            return booking;
        });
    }
    getUnavailableSlots(tradesmanId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateToCheck = new Date(date);
            const result = yield bookinModel_1.default.aggregate([
                {
                    // Match documents where bookingDate is the same as the dateToCheck and tradesmanId matches
                    $match: {
                        tradesmanId: new mongodb_1.ObjectId(tradesmanId),
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
        });
    }
    changePaymentStatus(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookinModel_1.default.findByIdAndUpdate(bookingId, {
                $set: {
                    paymentDetails: {
                        status: "success",
                        date: new Date(),
                    },
                },
            }, { new: true });
            return booking;
        });
    }
}
exports.default = BookingRepository;
//# sourceMappingURL=bookingRepository.js.map