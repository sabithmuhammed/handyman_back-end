import Review from "../domain/review";
import { Next, Req, Res } from "../infrastructure/types/expressTypes";
import ReviewUsecase from "../use_case/reviewUsecase";

export default class ReviewController {
    constructor(private reviewUsecase: ReviewUsecase) {}
    async postNewReview(req: Req, res: Res, next: Next) {
        try {
            const { bookingId, rating, review, tradesmanId } = req.body;
            const userId = (req as any)?.user;
            const newReview: Review = {
                bookingId,
                tradesmanId,
                userId,
                rating,
                review,
            };

            const result = await this.reviewUsecase.postReview(newReview);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getReviewForBooking(req: Req, res: Res, next: Next) {
        try {
            const { bookingId } = req.params;
            const result = await this.reviewUsecase.getReviewForBooking(
                bookingId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
}
