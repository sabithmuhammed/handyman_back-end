import Review from "../../domain/review";

export default interface IReviewRepository {
    postReview(review: Review): Promise<Review>;
    getReviewFromBookingId(bookingId: string): Promise<Review | null>;
    getAllReviewForTradesman(tradesmanId: string): Promise<Review[]>;

}
