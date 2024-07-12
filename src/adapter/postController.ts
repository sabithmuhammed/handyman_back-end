import { IFile } from "../infrastructure/middlewares/multer";
import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import Cloudinary from "../infrastructure/utils/cloudinary";
import FileOperations from "../infrastructure/utils/fileOperations";
import PostUsecase from "../use_case/postUsecase";

export default class PostController {
    constructor(
        private postUsecase: PostUsecase,
        private cloudinary: Cloudinary,
        private fileOperations: FileOperations
    ) {}
    async getPost(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            const posts = await this.postUsecase.getPosts(tradesmanId);
            res.status(posts.status).json(posts.data);
        } catch (error) {
            next(error);
        }
    }

    async getPostsById(req: Req, res: Res, next: Next) {
        try {
            const { tradesmanId } = req.params;
            const posts = await this.postUsecase.getPosts(tradesmanId);
            res.status(posts.status).json(posts.data);
        } catch (error) {
            next(error);
        }
    }

    async addPost(req: Req, res: Res, next: Next) {
        try {
            const tradesmanId = (req as any)?.tradesman;
            let { text = "" } = req.body;
            const postImage = req.file;
            let image = "";
            if (postImage) {
                image = await this.cloudinary.saveToCloudinary(postImage);
                await this.fileOperations.deleteFile(postImage.path);
            }

            const post = await this.postUsecase.addNewPost({
                text: text,
                image: image,
                date: new Date(),
                tradesmanId,
            });
            res.status(post.status).json(post.data);
        } catch (error) {
            next(error);
        }
    }

    async addLike(req: Req, res: Res, next: Next) {
        try {
            const { postId } = req.params;
            const userId = (req as any)?.user;
            const result = await this.postUsecase.LikePost(postId, userId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async removeLike(req: Req, res: Res, next: Next) {
        try {
            const { postId } = req.params;
            const userId = (req as any)?.user;
            const result = await this.postUsecase.unLikePost(postId, userId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getAllComments(req: Req, res: Res, next: Next) {
        try {
            const { postId } = req.params;
            const result = await this.postUsecase.getAllComments(postId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async addComment(req: Req, res: Res, next: Next) {
        try {
            const { postId, comment } = req.body;
            const userId = (req as any)?.user;
            const result = await this.postUsecase.addComment(
                postId,
                userId,
                comment
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req: Req, res: Res, next: Next) {
        try {
            const { commentId } = req.params;
            const result = await this.postUsecase.deleteComment(commentId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getCommentCount(req: Req, res: Res, next: Next) {
        try {
            const { postId } = req.params;
            const result = await this.postUsecase.getCount(postId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async addReply(req: Req, res: Res, next: Next) {
        try {
            const { commentId, comment } = req.body;
            const userId = (req as any)?.user;
            const result = await this.postUsecase.addReply(
                commentId,
                userId,
                comment
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req: Req, res: Res, next: Next) {
        try {
            const { postId } = req.params;
            const result = await this.postUsecase.deletePost(postId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async editPost(req: Req, res: Res, next: Next) {
        try {
            const { postId } = req.params;
            const { text } = req.body;
            const result = await this.postUsecase.editPost(postId, text);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getAllPosts(req: Req, res: Res, next: Next) {
        try {
            const result = await this.postUsecase.getAllPosts();
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
}
