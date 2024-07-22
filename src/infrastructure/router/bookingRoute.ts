import express from "express";
import { Req, Res, Next } from "../types/expressTypes";

import userAuth from "../middlewares/userAuth";
import generateUniqueId from "generate-unique-id";
import tradesmanAuth from "../middlewares/tradesmanAuth";
import BookingRepository from "../repository/bookingRepository";
import BookingUsecase from "../../use_case/bookingUsecase";
import BookingController from "../../adapter/bookingController";
import InvoiceRepository from "../repository/invoiceRepository";
import InvoiceUsecase from "../../use_case/invoiceUsecase";

const bookingRouter = express.Router();

const bookingRepository = new BookingRepository();
const bookingUsecase = new BookingUsecase(bookingRepository, generateUniqueId);
const invoiceRepository = new InvoiceRepository();
const invoiceUsecase = new InvoiceUsecase(invoiceRepository, generateUniqueId);
const bookingController = new BookingController(bookingUsecase,invoiceUsecase);

bookingRouter.post("/new-booking", userAuth, (req: Req, res: Res, next: Next) =>
    bookingController.addNewBooking(req, res, next)
);

bookingRouter.get(
    "/pending-bookings",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.getPendingBookings(req, res, next)
);

bookingRouter.patch(
    "/schedule-booking/:bookingId",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.sheduleBooking(req, res, next)
);

bookingRouter.get(
    "/get-scheduled-dates/:tradesman",

    (req: Req, res: Res, next: Next) =>
        bookingController.getScheduledDates(req, res, next)
);

bookingRouter.patch(
    "/cancel-booking/:bookingId",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.cancelBooking(req, res, next)
);

bookingRouter.get(
    "/get-scheduled-booking",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.getScheduledBooking(req, res, next)
);

bookingRouter.patch(
    "/job-complete/:bookingId",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.changeToCompled(req, res, next)
);

bookingRouter.get(
    "/get-completed",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.getCompletedBookings(req, res, next)
);

bookingRouter.get(
    "/get-user-bookings",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.getUserBooking(req, res, next)
);

bookingRouter.post(
    "/create-invoice",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.createInvoice(req, res, next)
);

bookingRouter.patch(
    "/invoice-to-paid/:id",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        bookingController.changeToPaid(req, res, next)
);

bookingRouter.get('/get-unavailable-slots',(req: Req, res: Res, next: Next) =>
    bookingController.getAllUnavailableSlots(req, res, next))

bookingRouter.patch('/payment-successful/:bookingId',(req: Req, res: Res, next: Next) =>
    bookingController.changePaymentToSuccess(req, res, next))

bookingRouter.get('/dashboard-bookings',tradesmanAuth,(req: Req, res: Res, next: Next) =>
    bookingController.dashBoardBookingDetails(req, res, next))

bookingRouter.get('/get-service-count',tradesmanAuth,(req: Req, res: Res, next: Next) =>
    bookingController.getServiceCount(req, res, next))

bookingRouter.get('/get-amount-aggregation',tradesmanAuth,(req: Req, res: Res, next: Next) =>
    bookingController.getAmountAggregation(req, res, next))


export default bookingRouter;
