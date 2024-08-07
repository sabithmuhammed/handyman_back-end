import Review from "../../domain/review";

export default interface IReviewRepository {
    postReview(review: Review): Promise<Review>;
    getReviewFromBookingId(bookingId: string): Promise<Review | null>;
    getAllReviewForTradesman(tradesmanId: string, limit: number, page: number): Promise<{data:Review[],hasMore:boolean}>;
    editReview(
        reviewId: string,
        review: string,
        rating: number
    ): Promise<Review | null>;
    getReviewCountAndSum(tradesmanId:string):Promise<{_id:number,sum:number,count:number}[]>
}
