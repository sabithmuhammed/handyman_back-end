import Comment from "../../domain/comment";

export default interface IConversationRepository {
    addComment(
        postId: string,
        userId: string,
        comment: string
    ): Promise<Comment>;

    addReply(
        commentId: string,
        userId: string,
        comment: string
    ): Promise<Comment | null>;
    deleteComment(commentId: string): Promise<Comment | null>;
    getComments(postId: string): Promise<Comment[]>;
    getCommentCount(postId:string):Promise<number>;
    removeReply(commentId:string,replyId:string):Promise<Comment | null>
    
}
