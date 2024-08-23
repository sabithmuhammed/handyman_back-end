import express from "express";
import { Req, Res, Next } from "../types/expressTypes";
import { Multer } from "../middlewares/multer";
import userAuth from "../middlewares/userAuth";
import Cloudinary from "../utils/cloudinary";
import FileOperations from "../utils/fileOperations";
import PostRepository from "../repository/postRepository";
import PostUsecase from "../../use_case/postUsecase";
import PostController from "../../adapter/postController";
import tradesmanAuth from "../middlewares/tradesmanAuth";
import CommentRepository from "../repository/commentRepository";

const postRouter = express.Router();
const cloudinary = new Cloudinary();
const fileOperations = new FileOperations();

const postRepository = new PostRepository();
const commentRepository = new CommentRepository();
const postUsecase = new PostUsecase(postRepository, commentRepository);

const postController = new PostController(
    postUsecase,
    cloudinary,
    fileOperations
);

postRouter.get("/get-posts", tradesmanAuth, (req: Req, res: Res, next: Next) =>
    postController.getPost(req, res, next)
);

postRouter.get("/get-posts-id/:tradesmanId", (req: Req, res: Res, next: Next) =>
    postController.getPostsById(req, res, next)
);

postRouter.post(
    "/add-post",
    tradesmanAuth,
    Multer.single("image"),
    (req: Req, res: Res, next: Next) => postController.addPost(req, res, next)
);

postRouter.patch(
    "/add-like/:postId",
    userAuth,
    (req: Req, res: Res, next: Next) => postController.addLike(req, res, next)
);

postRouter.patch(
    "/remove-like/:postId",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        postController.removeLike(req, res, next)
);

postRouter.post("/add-comment", userAuth, (req: Req, res: Res, next: Next) =>
    postController.addComment(req, res, next)
);

postRouter.delete(
    "/delete-comment/:commentId",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        postController.deleteComment(req, res, next)
);

postRouter.delete(
    "/delete-reply/:commentId/:replyId",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        postController.deleteReply(req, res, next)
);

postRouter.post("/add-reply", userAuth, (req: Req, res: Res, next: Next) =>
    postController.addReply(req, res, next)
);

postRouter.get(
    "/get-comments/:postId",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        postController.getAllComments(req, res, next)
);

postRouter.get("/get-count/:postId", (req: Req, res: Res, next: Next) =>
    postController.getCommentCount(req, res, next)
);

postRouter.delete(
    "/delete-post/:postId",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        postController.deletePost(req, res, next)
);

postRouter.patch(
    "/edit-post/:postId",
    tradesmanAuth,
    (req: Req, res: Res, next: Next) =>
        postController.editPost(req, res, next)
);

postRouter.get(
    "/get-all-posts",
    (req: Req, res: Res, next: Next) =>
        postController.getAllPosts(req, res, next)
);

export default postRouter;
