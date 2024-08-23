import Post from "../../domain/post";

export default interface IPostRepository {
    addPost(post: Post): Promise<Post>;
    getPost(tradesmanId: string): Promise<Post[]>;
    addLike(postId: string, userId: string): Promise<number>;
    removeLike(postId: string, userId: string): Promise<number>;
    removePost(postId: string): Promise<Post | null>;
    editPost(postId: string, text: string): Promise<Post | null>;
    getAllPosts(
        page: number,
        limit: number
    ): Promise<{ data: Post[]; hasMore: boolean }>;
}
