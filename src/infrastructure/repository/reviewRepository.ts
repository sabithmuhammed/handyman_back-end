import Review from "../../domain/review";
import ReviewModel from "../database/reviewModel";
import IReviewRepository from "../../use_case/interface/IReviewRepository";
import { ObjectId } from "mongodb";

export default class ReviewRepository implements IReviewRepository {
    async postReview(review: Review): Promise<Review> {
        const newReview = await new ReviewModel(review).save();
        return newReview;
    }
    async getReviewFromBookingId(bookingId: string): Promise<Review | null> {
        const review = await ReviewModel.findOne({ bookingId });
        return review;
    }

    async editReview(
        reviewId: string,
        review: string,
        rating: number
    ): Promise<Review | null> {
        const edittedReview = await ReviewModel.findByIdAndUpdate(
            reviewId,
            {
                review,
                rating,
            },
            { new: true }
        );
        return edittedReview;
    }

    async getAllReviewForTradesman(
        tradesmanId: string,
        limit: number,
        page: number
    ): Promise<{ data: Review[]; hasMore: boolean }> {
        const skip = (page - 1) * limit;

        const reviews = await ReviewModel.find({
            tradesmanId,
        })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "userId",
                select: "name profile",
            })
            .exec();

        const totalReviewsCount = await ReviewModel.countDocuments({
            tradesmanId,
        });
        const hasMore = skip + limit < totalReviewsCount;

        return {
            data: reviews,
            hasMore,
        };
    }
    async getReviewCountAndSum(
        tradesmanId: string
    ): Promise<{ _id: number; sum: number; count: number }[]> {
        const result = await ReviewModel.aggregate([
            {
                $match: {
                    tradesmanId:new ObjectId(tradesmanId),
                },
            },
            {
                $group: {
                    _id: "$rating",
                    sum: {
                        $sum: "$rating",
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        return result;
    }
}
