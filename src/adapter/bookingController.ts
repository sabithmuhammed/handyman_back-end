import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import BookingUsecase from "../use_case/bookingUsecase";
import InvoiceUsecase from "../use_case/invoiceUsecase";

export default class BookingController {
    constructor(
        private bookingUsecase: BookingUsecase,
        private invoiceUsecase: InvoiceUsecase
    ) {}

    async addNewBooking(req: Req, res: Res, next: Next) {
        try {
            const bookingData = req.body;
            const userId = (req as any)?.user;
            bookingData.userId = userId;
            const result = await this.bookingUsecase.addNewBooking(bookingData);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getPendingBookings(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const result = await this.bookingUsecase.getPendingBookings(
                tradesmanId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
    async sheduleBooking(req: Req, res: Res, next: Next) {
        try {
            const { bookingId } = req.params;
            const { scheduledDate } = req.body;
            const result = await this.bookingUsecase.sheduleBooking(
                bookingId,
                scheduledDate
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
    async getScheduledDates(req: Req, res: Res, next: Next) {
        try {
            const { tradesman } = req.params;
            const result = await this.bookingUsecase.getScheduledDates(
                tradesman
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async cancelBooking(req: Req, res: Res, next: Next) {
        try {
            const { bookingId } = req.params;
            const result = await this.bookingUsecase.cancelBooking(bookingId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getScheduledBooking(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { date } = req.query;
            const result = await this.bookingUsecase.getScheduledBooking(
                tradesmanId,
                date as string
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async changeToCompled(req: Req, res: Res, next: Next) {
        try {
            const { bookingId } = req.params;
            const result = await this.bookingUsecase.changeToCompled(bookingId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getCompletedBookings(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { date } = req.query;
            const result = await this.bookingUsecase.getCompledBookings(
                tradesmanId,
                date as string
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getUserBooking(req: Req, res: Res, next: Next) {
        try {
            const userId = (req as any)?.user;
            const result = await this.bookingUsecase.getUserBookings(userId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async createInvoice(req: Req, res: Res, next: Next) {
        try {
            const invoice = req.body;
            const result = await this.invoiceUsecase.createNewInvoice(invoice);
            if (result.status == STATUS_CODES.OK) {
                await this.bookingUsecase.updateInvoiceId(
                    result.data.bookingId as string,
                    result.data._id as string
                );
            }
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async changeToPaid(req: Req, res: Res, next: Next) {
        try {
            const { id } = req.body;
            const result = await this.invoiceUsecase.changeStatusToPaid(id);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getAllUnavailableSlots(req: Req, res: Res, next: Next) {
        try {
            const { tradesmanId, date } = req.query;
            const result = await this.bookingUsecase.getAllUnavailableSlots(
                tradesmanId as string,
                date as string
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
    async changePaymentToSuccess(req: Req, res: Res, next: Next) {
        try {
            const { bookingId } = req.params;

            const result = await this.bookingUsecase.changePaymentToSuccess(
                bookingId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async dashBoardBookingDetails(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;

            const result = await this.bookingUsecase.dashBoardBookingDetails(
                tradesmanId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getServiceCount(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { filter } = req.query;

            const result = await this.bookingUsecase.getServiceCount(
                tradesmanId,
                filter as string
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getAmountAggregation(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const { filter } = req.query;

            const result = await this.bookingUsecase.getAmountAggregation(
                tradesmanId,
                filter as string
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
}
