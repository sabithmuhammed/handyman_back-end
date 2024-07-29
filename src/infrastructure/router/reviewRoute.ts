import express from "express";
import { Req, Res, Next } from "../types/expressTypes";
import userAuth from "../middlewares/userAuth";
import ReviewRepository from "../repository/reviewRepository";
import ReviewUsecase from "../../use_case/reviewUsecase";
import ReviewController from "../../adapter/reviewController";

const reviewRouter = express.Router();

const reviewRepository = new ReviewRepository();
const reviewUsecase = new ReviewUsecase(reviewRepository);
const reviewController = new ReviewController(reviewUsecase);

reviewRouter.get("/get-review-booking/:bookingId", userAuth, (req, res, next) =>
    reviewController.getReviewForBooking(req, res, next)
);
reviewRouter.post("/add-review", userAuth, (req, res, next) =>
    reviewController.postNewReview(req, res, next)
);

export default reviewRouter;