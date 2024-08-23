import Booking from "../../domain/booking";

export default interface IBookingRepository {
    createNewBooking(booking: Booking): Promise<Booking>;
    getAllPendingBookings(tradesmanId: string): Promise<Booking[]>;
    scheduleBooking(
        bookingId: string,
        scheduledDate: Date[]
    ): Promise<Booking | null>;
    getScheduledDates(tradesmanId: string, startingDate: Date): Promise<Date[]>;
    checkAvailability(
        tradesmanId: string,
        date: Date,
        slot: string[]
    ): Promise<boolean>;
    rejectBooking(bookingId: string): Promise<Booking | null>;
    getScheduledBooking(
        tradesmanId: string,
        date: string,
        page: number | undefined,
        pageSize: number | undefined
    ): Promise<{ bookings: Booking[]; totalCount: number; page: number }>;
    changeToCompleted(bookingId: string): Promise<Booking | null>;
    getCompletedBookings(
        tradesmanId: string,
        date: string,
        page: number | undefined,
        pageSize: number | undefined
    ): Promise<{ bookings: Booking[]; totalCount: number; page: number }>;
    getAllUserBookings(
        userId: string,
        limit: number,
        page: number
    ): Promise<{ data: Booking[]; hasMore: boolean }>;
    addInvoice(id: string, invoice: string): Promise<Booking | null>;
    getUnavailableSlots(tradesmanId: string, date: string): Promise<any[]>;
    changePaymentStatus(bookingId: string): Promise<Booking | null>;
    getBookingsCount(tradesmanId: string): Promise<any>;
    getServiceAndCount(tradesmanId: string, filter: string): Promise<any>;
    getPaymentAggregation(tradesmanId: string, filter: string): Promise<any>;
    checkBookingForDate(tradesmanId: string, date: string): Promise<number>;
}
