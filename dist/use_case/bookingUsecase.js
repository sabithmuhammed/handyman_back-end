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
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = require("../infrastructure/constants/httpStatusCodes");
class BookingUsecase {
    constructor(bookingRepository, generateUniqueId) {
        this.bookingRepository = bookingRepository;
        this.generateUniqueId = generateUniqueId;
    }
    addNewBooking(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            // const alreadyBooked = await this.bookingRepository.checkAvailability(
            //     booking.tradesmanId as string,
            //     new Date(booking.bookingDate)
            // );
            if (false /*alreadyBooked*/) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.CONFLICT,
                    data: "This date is unavailable. Please select other dates",
                };
            }
            booking.bookingNumber = this.generateUniqueId({
                length: 10,
                useLetters: false,
            });
            const newBooking = yield this.bookingRepository.createNewBooking(booking);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: newBooking,
            };
        });
    }
    getPendingBookings(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.bookingRepository.getAllPendingBookings(tradesmanId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: bookings,
            };
        });
    }
    sheduleBooking(bookingId, scheduledDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this.bookingRepository.scheduleBooking(bookingId, scheduledDate);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: booking,
            };
        });
    }
    getScheduledDates(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const startingDate = new Date(today);
            startingDate.setDate(today.getDate() + 1);
            startingDate.setHours(0, 0, 0, 0);
            const schedules = yield this.bookingRepository.getScheduledDates(tradesmanId, startingDate);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: schedules,
            };
        });
    }
    cancelBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.rejectBooking(bookingId);
            if (result) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: result,
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.NOT_FOUND,
                data: "No Booking Found",
            };
        });
    }
    getScheduledBooking(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.bookingRepository.getScheduledBooking(tradesmanId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data,
            };
        });
    }
    changeToCompled(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.changeToCompleted(bookingId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    getCompledBookings(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.getCompletedBookings(tradesmanId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    getUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.getAllUserBookings(userId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    updateInvoiceId(id, invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.addInvoice(id, invoice);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    getAllUnavailableSlots(tradesmanId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.getUnavailableSlots(tradesmanId, date);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    changePaymentToSuccess(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.changePaymentStatus(bookingId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
}
exports.default = BookingUsecase;
//# sourceMappingURL=bookingUsecase.js.map