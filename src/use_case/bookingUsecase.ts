import BookingRepository from "../infrastructure/repository/bookingRepository";
import Booking from "../domain/booking";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import GenerateUniqueId from "generate-unique-id";

export default class BookingUsecase {
    constructor(
        private bookingRepository: BookingRepository,
        private generateUniqueId: typeof GenerateUniqueId
    ) {}
    async addNewBooking(booking: Booking) {
        // const alreadyBooked = await this.bookingRepository.checkAvailability(
        //     booking.tradesmanId as string,
        //     new Date(booking.bookingDate)
        // );
        if (false /*alreadyBooked*/) {
            return {
                status: STATUS_CODES.CONFLICT,
                data: "This date is unavailable. Please select other dates",
            };
        }
        booking.bookingNumber = this.generateUniqueId({
            length: 10,
            useLetters: false,
        });
        const newBooking = await this.bookingRepository.createNewBooking(
            booking
        );
        return {
            status: STATUS_CODES.OK,
            data: newBooking,
        };
    }
    async getPendingBookings(tradesmanId: string) {
        const bookings = await this.bookingRepository.getAllPendingBookings(
            tradesmanId
        );
        return {
            status: STATUS_CODES.OK,
            data: bookings,
        };
    }

    async sheduleBooking(bookingId: string, scheduledDate: Date[]) {
        const booking = await this.bookingRepository.scheduleBooking(
            bookingId,
            scheduledDate
        );
        return {
            status: STATUS_CODES.OK,
            data: booking,
        };
    }

    async getScheduledDates(tradesmanId: string) {
        const today = new Date();
        const startingDate = new Date(today);
        startingDate.setDate(today.getDate() + 1);
        startingDate.setHours(0, 0, 0, 0);
        const schedules = await this.bookingRepository.getScheduledDates(
            tradesmanId,
            startingDate
        );
        return {
            status: STATUS_CODES.OK,
            data: schedules,
        };
    }

    async cancelBooking(bookingId: string) {
        const result = await this.bookingRepository.rejectBooking(bookingId);
        if (result) {
            return {
                status: STATUS_CODES.OK,
                data: result,
            };
        }
        return {
            status: STATUS_CODES.NOT_FOUND,
            data: "No Booking Found",
        };
    }

    async getScheduledBooking(tradesmanId: string) {
        const data = await this.bookingRepository.getScheduledBooking(
            tradesmanId
        );
        return {
            status: STATUS_CODES.OK,
            data,
        };
    }

    async changeToCompled(bookingId: string) {
        const result = await this.bookingRepository.changeToCompleted(
            bookingId
        );
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getCompledBookings(tradesmanId: string) {
        const result = await this.bookingRepository.getCompletedBookings(
            tradesmanId
        );
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getUserBookings(userId: string) {
        const result = await this.bookingRepository.getAllUserBookings(userId);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async updateInvoiceId(id: string, invoice: string) {
        const result = await this.bookingRepository.addInvoice(id, invoice);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getAllUnavailableSlots(tradesmanId: string, date: string) {
        const result = await this.bookingRepository.getUnavailableSlots(
            tradesmanId,
            date
        );

        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }
    async changePaymentToSuccess(bookingId: string) {
        const result = await this.bookingRepository.changePaymentStatus(
            bookingId
        );

        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }
}
