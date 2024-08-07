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

    async editReview(reviewId: string, review: string, rating: number) {
        const result = await this.reviewRepository.editReview(
            reviewId,
            review,
            rating
        );
        if (result) {
            return {
                status: STATUS_CODES.OK,
                data: result,
            };
        }
        return {
            status: STATUS_CODES.NOT_FOUND,
            data: "Review not found",
        };
    }

    async getReviewsForTradesman(
        tradesmanId: string,
        limit: number,
        page: number
    ) {
        const result = await this.reviewRepository.getAllReviewForTradesman(
            tradesmanId,
            limit,
            page
        );
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getSumAndCount(tradesmanId: string) {
        const result = await this.reviewRepository.getReviewCountAndSum(
            tradesmanId
        );
        const totalCount: number = result.reduce(
            (acc, curr) => acc + curr.count,
            0
        );
        const totalSum: number = result.reduce(
            (acc, curr) => acc + curr.sum,
            0
        );
        const starBarData: number[] = [0, 0, 0, 0, 0];
        
        result.forEach((item) => {
            starBarData[item._id-1] = (item.count / totalCount) * 100;
        });
        const avarage = totalSum / totalCount;
        
        return {
            status: STATUS_CODES.OK,
            data: {
                totalCount,
                starBarData,
                avarage,
            },
        };
    }
}
