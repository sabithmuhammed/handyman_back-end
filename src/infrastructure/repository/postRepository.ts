import Post from "../../domain/post";
import IPostRepository from "../../use_case/interface/IPostRepository";
import PostModel from "../database/postModel";

export default class PostRepository implements IPostRepository {
    async addPost(post: Post): Promise<Post> {
        const newPost = new PostModel(post);
        await newPost.save();
        return newPost;
    }

    async getPost(tradesmanId:string): Promise<Post[]> {
        const allPosts = await PostModel.find({tradesmanId}).sort({date:-1});
        return allPosts;
    }
}
