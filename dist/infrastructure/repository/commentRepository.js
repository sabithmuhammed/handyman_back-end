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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentModel_1 = __importDefault(require("../database/commentModel"));
const userModel_1 = __importDefault(require("../database/userModel"));
class CommentRepository {
    addComment(postId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = new commentModel_1.default({
                postId,
                userId,
                comment,
            });
            yield newComment.save();
            return newComment;
        });
    }
    addReply(commentId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedComment = yield commentModel_1.default.findByIdAndUpdate(commentId, {
                $push: {
                    replies: {
                        userId,
                        comment,
                    },
                },
            }, {
                new: true,
            })
                .populate({
                path: "userId",
                select: "name profile",
            })
                .populate({
                path: "replies",
                populate: {
                    path: "userId",
                    model: "User",
                    select: "name profile",
                },
            });
            return updatedComment;
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentModel_1.default.findById(commentId);
            if (comment) {
                if (comment.replies.length !== 0) {
                    comment.softDelete = true;
                    comment.comment = "[Comment has been deleted]";
                    yield comment.save();
                }
                else {
                    const deletedComment = yield commentModel_1.default.findByIdAndDelete(commentId);
                    return deletedComment;
                }
            }
            yield userModel_1.default.populate(comment, {
                path: "userId replies.userId",
                select: { name: 1, profile: 1 }
            });
            return comment;
        });
    }
    getComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield commentModel_1.default.find({ postId })
                .populate({
                path: "userId",
                select: "name profile",
            })
                .populate({
                path: "replies",
                populate: {
                    path: "userId",
                    model: "User",
                    select: "name profile",
                },
            });
            return comments;
        });
    }
    getCommentCount(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalCount = yield commentModel_1.default.countDocuments({
                postId,
            });
            return totalCount;
        });
    }
}
exports.default = CommentRepository;
//# sourceMappingURL=commentRepository.js.map