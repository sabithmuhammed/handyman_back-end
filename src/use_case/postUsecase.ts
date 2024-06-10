import Post from "../domain/post";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import PostRepository from "../infrastructure/repository/postRepository";

export default class PostUsecase {
    constructor(private postRepository: PostRepository) {}

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
}
