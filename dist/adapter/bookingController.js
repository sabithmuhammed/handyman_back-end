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
class BookingController {
    constructor(bookingUsecase, invoiceUsecase) {
        this.bookingUsecase = bookingUsecase;
        this.invoiceUsecase = invoiceUsecase;
    }
    addNewBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                bookingData.userId = userId;
                const result = yield this.bookingUsecase.addNewBooking(bookingData);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPendingBookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req === null || req === void 0 ? void 0 : req.tradesman;
                const result = yield this.bookingUsecase.getPendingBookings(tradesmanId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    sheduleBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const { scheduledDate } = req.body;
                const result = yield this.bookingUsecase.sheduleBooking(bookingId, scheduledDate);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getScheduledDates(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tradesman } = req.params;
                const result = yield this.bookingUsecase.getScheduledDates(tradesman);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    cancelBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const result = yield this.bookingUsecase.cancelBooking(bookingId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getScheduledBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req === null || req === void 0 ? void 0 : req.tradesman;
                const result = yield this.bookingUsecase.getScheduledBooking(tradesmanId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeToCompled(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const result = yield this.bookingUsecase.changeToCompled(bookingId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCompletedBookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req === null || req === void 0 ? void 0 : req.tradesman;
                const result = yield this.bookingUsecase.getCompledBookings(tradesmanId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const result = yield this.bookingUsecase.getUserBookings(userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createInvoice(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoice = req.body;
                const result = yield this.invoiceUsecase.createNewInvoice(invoice);
                if (result.status == httpStatusCodes_1.STATUS_CODES.OK) {
                    yield this.bookingUsecase.updateInvoiceId(result.data.bookingId, result.data._id);
                }
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeToPaid(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const result = yield this.invoiceUsecase.changeStatusToPaid(id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllUnavailableSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tradesmanId, date } = req.query;
                const result = yield this.bookingUsecase.getAllUnavailableSlots(tradesmanId, date);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    changePaymentToSuccess(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const result = yield this.bookingUsecase.changePaymentToSuccess(bookingId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = BookingController;
//# sourceMappingURL=bookingController.js.map