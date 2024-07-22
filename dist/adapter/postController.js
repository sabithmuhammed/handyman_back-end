"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class PostController {
    constructor(postUsecase, cloudinary, fileOperations) {
        this.postUsecase = postUsecase;
        this.cloudinary = cloudinary;
        this.fileOperations = fileOperations;
    }
    getPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req === null || req === void 0 ? void 0 : req.tradesman;
                const posts = yield this.postUsecase.getPosts(tradesmanId);
                res.status(posts.status).json(posts.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostsById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tradesmanId } = req.params;
                const posts = yield this.postUsecase.getPosts(tradesmanId);
                res.status(posts.status).json(posts.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradesmanId = req === null || req === void 0 ? void 0 : req.tradesman;
                let { text = "" } = req.body;
                const postImage = req.file;
                let image = "";
                if (postImage) {
                    image = yield this.cloudinary.saveToCloudinary(postImage);
                    yield this.fileOperations.deleteFile(postImage.path);
                }
                const post = yield this.postUsecase.addNewPost({
                    text: text,
                    image: image,
                    date: new Date(),
                    tradesmanId,
                });
                res.status(post.status).json(post.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const result = yield this.postUsecase.LikePost(postId, userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const result = yield this.postUsecase.unLikePost(postId, userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const result = yield this.postUsecase.getAllComments(postId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, comment } = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const result = yield this.postUsecase.addComment(postId, userId, comment);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId } = req.params;
                const result = yield this.postUsecase.deleteComment(commentId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCommentCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const result = yield this.postUsecase.getCount(postId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId, comment } = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.user;
                const result = yield this.postUsecase.addReply(commentId, userId, comment);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const result = yield this.postUsecase.deletePost(postId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    editPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const { text } = req.body;
                const result = yield this.postUsecase.editPost(postId, text);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postUsecase.getAllPosts();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = PostController;
//# sourceMappingURL=postController.js.map