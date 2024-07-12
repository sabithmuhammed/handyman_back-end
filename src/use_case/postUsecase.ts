import Post from "../domain/post";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import PostRepository from "../infrastructure/repository/postRepository";
import CommentRepository from "../infrastructure/repository/commentRepository";

export default class PostUsecase {
    constructor(
        private postRepository: PostRepository,
        private commentRepository: CommentRepository
    ) {}

    async addNewPost(post: Post) {
        const newPost = await this.postRepository.addPost(post);
        return {
            status: STATUS_CODES.OK,
            data: newPost,
        };
    }

    async getPosts(tradesmanId: string) {
        const posts = await this.postRepository.getPost(tradesmanId);
        return {
            status: STATUS_CODES.OK,
            data: posts,
        };
    }

    async LikePost(postId: string, userId: string) {
        const count = await this.postRepository.addLike(postId, userId);
        return {
            status: STATUS_CODES.OK,
            data: {
                likeCount: count,
            },
        };
    }

    async unLikePost(postId: string, userId: string) {
        const count = await this.postRepository.removeLike(postId, userId);
        return {
            status: STATUS_CODES.OK,
            data: {
                likeCount: count,
            },
        };
    }

    async getAllComments(postId: string) {
        const result = await this.commentRepository.getComments(postId);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async addComment(postId: string, userId: string, comment: string) {
        const result = await this.commentRepository.addComment(
            postId,
            userId,
            comment
        );
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async deleteComment(commentId: string) {
        const result = await this.commentRepository.deleteComment(commentId);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async addReply(commentId: string, userId: string, comment: string) {
        const result = await this.commentRepository.addReply(
            commentId,
            userId,
            comment
        );
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getCount(postId: string) {
        const result = await this.commentRepository.getCommentCount(postId);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async deletePost(postId: string) {
        const result = await this.postRepository.removePost(postId);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async editPost(postId: string, text: string) {
        const result = await this.postRepository.editPost(postId, text);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getAllPosts() {
        const result = await this.postRepository.getAllPosts();
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }
}
