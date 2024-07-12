import Post from "../../domain/post";
import IPostRepository from "../../use_case/interface/IPostRepository";
import CommentModel from "../database/commentModel";
import PostModel from "../database/postModel";

export default class PostRepository implements IPostRepository {
    async addPost(post: Post): Promise<Post> {
        const newPost = new PostModel(post);
        await newPost.save();
        return newPost;
    }

    async getPost(tradesmanId: string): Promise<Post[]> {
        const allPosts = await PostModel.find({ tradesmanId }).sort({
            date: -1,
        });
        return allPosts;
    }

    async addLike(postId: string, userId: string): Promise<number> {
        const post = await PostModel.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: userId } },
            { new: true }
        );
        return post?.likes?.length ?? 0;
    }

    async removeLike(postId: string, userId: string): Promise<number> {
        const post = await PostModel.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } },
            { new: true }
        );
        return post?.likes?.length ?? 0;
    }
    async removePost(postId: string): Promise<Post | null> {
        const deletedPost = await PostModel.findByIdAndDelete(postId);
        await CommentModel.deleteMany({ postId });
        return deletedPost;
    }

    async editPost(postId: string, text: string): Promise<Post | null> {
        const post = await PostModel.findByIdAndUpdate(
            postId,
            {
                $set: {
                    text,
                },
            },
            { new: true }
        );
        return post;
    }

    async getAllPosts(): Promise<Post[]> {
        const posts = await PostModel.find().populate({
            path: "tradesmanId",
            select: "name profile",
        });
        console.log(posts);
        
        return posts;
    }
}
