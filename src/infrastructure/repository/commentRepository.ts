import Comment from "../../domain/comment";
import ICommentRepository from "../../use_case/interface/ICommentRepository";
import CommentModel from "../database/commentModel";
import UserModel from "../database/userModel";

export default class CommentRepository implements ICommentRepository {
    async addComment(
        postId: string,
        userId: string,
        comment: string
    ): Promise<Comment> {
        const newComment = new CommentModel({
            postId,
            userId,
            comment,
        });
        await newComment.save();
        return newComment;
    }

    async addReply(
        commentId: string,
        userId: string,
        comment: string
    ): Promise<Comment | null> {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            {
                $push: {
                    replies: {
                        userId,
                        comment,
                    },
                },
            },
            {
                new: true,
            }
        )
            .populate({
                path: "userId",
                select: "name profile",
            })
            .populate({
                path: "replies",
                populate: {
                    path: "userId",
                    model: "User",
                    select: "name profile",
                },
            });
        return updatedComment;
    }

    async deleteComment(commentId: string): Promise<Comment | null> {
        const comment = await CommentModel.findById(commentId);
        if (comment) {
            if (comment.replies.length !== 0) {
                comment.softDelete = true;
                comment.comment = "[Comment has been deleted]";
                await comment.save();
            } else {
                const deletedComment = await CommentModel.findByIdAndDelete(
                    commentId
                );
                return deletedComment;
            }
        }
        await UserModel.populate(comment,{
            path:"userId replies.userId",
            select:{name:1,profile:1}
        })
        return comment;
    }

    async getComments(postId: string): Promise<Comment[]> {
        const comments = await CommentModel.find({ postId })
            .populate({
                path: "userId",
                select: "name profile",
            })
            .populate({
                path: "replies",
                populate: {
                    path: "userId",
                    model: "User",
                    select: "name profile",
                },
            });
        return comments;
    }

    async getCommentCount(postId: string): Promise<number> {
        const totalCount = await CommentModel.countDocuments({
            postId,
        });

        return totalCount;
    }
    async removeReply(commentId: string, replyId: string): Promise<Comment | null> {
        const comment = await CommentModel.findById(commentId);
    
        if (comment) {
            comment.replies = comment.replies.filter(
                (reply) => reply._id.toString() !== replyId
            );
    
            if (comment.softDelete && comment.replies.length === 0) {
                const deletedComment = await CommentModel.findByIdAndDelete(commentId);
                return deletedComment;
            } else {
                await comment.save();
            }
        }
    
        await UserModel.populate(comment, {
            path: "userId replies.userId",
            select: { name: 1, profile: 1 },
        });
    
        return comment;
    }
}
