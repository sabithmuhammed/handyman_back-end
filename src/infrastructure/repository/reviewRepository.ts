import Review from "../../domain/review";
import ReviewModel from "../database/reviewModel";
import IReviewRepository from "../../use_case/interface/IReviewRepository";

export default class ReviewRepository implements IReviewRepository {
    async postReview(review: Review): Promise<Review> {
        const newReview = await new ReviewModel(review).save();
        return newReview;
    }
    async getReviewFromBookingId(bookingId: string): Promise<Review | null> {
        const review = await ReviewModel.findOne({ bookingId });
        return review;
    }
    async getAllReviewForTradesman(tradesmanId: string): Promise<Review[]> {
        const review = await ReviewModel.find({ tradesmanId });
        return review;
    }
}
