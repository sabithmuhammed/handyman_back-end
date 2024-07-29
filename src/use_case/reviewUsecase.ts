import Review from "../domain/review";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ReviewRepository from "../infrastructure/repository/reviewRepository";

export default class ReviewUsecase {
    constructor(private reviewRepository: ReviewRepository) {}

    async postReview(review: Review) {
        const result = await this.reviewRepository.postReview(review);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getReviewForBooking(bookingId: string) {
        const result = await this.reviewRepository.getReviewFromBookingId(
            bookingId
        );
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }
    
}
