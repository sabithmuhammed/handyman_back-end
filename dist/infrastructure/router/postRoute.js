"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../middlewares/multer");
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const fileOperations_1 = __importDefault(require("../utils/fileOperations"));
const postRepository_1 = __importDefault(require("../repository/postRepository"));
const postUsecase_1 = __importDefault(require("../../use_case/postUsecase"));
const postController_1 = __importDefault(require("../../adapter/postController"));
const tradesmanAuth_1 = __importDefault(require("../middlewares/tradesmanAuth"));
const commentRepository_1 = __importDefault(require("../repository/commentRepository"));
const postRouter = express_1.default.Router();
const cloudinary = new cloudinary_1.default();
const fileOperations = new fileOperations_1.default();
const postRepository = new postRepository_1.default();
const commentRepository = new commentRepository_1.default();
const postUsecase = new postUsecase_1.default(postRepository, commentRepository);
const postController = new postController_1.default(postUsecase, cloudinary, fileOperations);
postRouter.get("/get-posts", tradesmanAuth_1.default, (req, res, next) => postController.getPost(req, res, next));
postRouter.get("/get-posts-id/:tradesmanId", (req, res, next) => postController.getPostsById(req, res, next));
postRouter.post("/add-post", tradesmanAuth_1.default, multer_1.Multer.single("image"), (req, res, next) => postController.addPost(req, res, next));
postRouter.patch("/add-like/:postId", userAuth_1.default, (req, res, next) => postController.addLike(req, res, next));
postRouter.patch("/remove-like/:postId", userAuth_1.default, (req, res, next) => postController.removeLike(req, res, next));
postRouter.post("/add-comment", userAuth_1.default, (req, res, next) => postController.addComment(req, res, next));
postRouter.delete("/delete-comment/:commentId", userAuth_1.default, (req, res, next) => postController.deleteComment(req, res, next));
postRouter.post("/add-reply", userAuth_1.default, (req, res, next) => postController.addReply(req, res, next));
postRouter.get("/get-comments/:postId", userAuth_1.default, (req, res, next) => postController.getAllComments(req, res, next));
postRouter.get("/get-count/:postId", (req, res, next) => postController.getCommentCount(req, res, next));
postRouter.delete("/delete-post/:postId", tradesmanAuth_1.default, (req, res, next) => postController.deletePost(req, res, next));
postRouter.patch("/edit-post/:postId", tradesmanAuth_1.default, (req, res, next) => postController.editPost(req, res, next));
postRouter.get("/get-all-posts", (req, res, next) => postController.getAllPosts(req, res, next));
exports.default = postRouter;
//# sourceMappingURL=postRoute.js.map