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
const httpStatusCodes_1 = require("../infrastructure/constants/httpStatusCodes");
class PostUsecase {
    constructor(postRepository, commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    addNewPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = yield this.postRepository.addPost(post);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: newPost,
            };
        });
    }
    getPosts(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.postRepository.getPost(tradesmanId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: posts,
            };
        });
    }
    LikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.postRepository.addLike(postId, userId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: {
                    likeCount: count,
                },
            };
        });
    }
    unLikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.postRepository.removeLike(postId, userId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: {
                    likeCount: count,
                },
            };
        });
    }
    getAllComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentRepository.getComments(postId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    addComment(postId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentRepository.addComment(postId, userId, comment);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentRepository.deleteComment(commentId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    addReply(commentId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentRepository.addReply(commentId, userId, comment);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    getCount(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentRepository.getCommentCount(postId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postRepository.removePost(postId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    editPost(postId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postRepository.editPost(postId, text);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postRepository.getAllPosts();
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
}
exports.default = PostUsecase;
//# sourceMappingURL=postUsecase.js.map