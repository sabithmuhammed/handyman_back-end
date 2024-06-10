import Post from "../../domain/post";

export default interface IPostRepository {
    addPost(post: Post): Promise<Post>;
    getPost(tradesmanId:string): Promise<Post[]>;
}
