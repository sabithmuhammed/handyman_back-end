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
const postModel_1 = __importDefault(require("../database/postModel"));
class PostRepository {
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = new postModel_1.default(post);
            yield newPost.save();
            return newPost;
        });
    }
    getPost(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield postModel_1.default.find({ tradesmanId }).sort({
                date: -1,
            });
            return allPosts;
        });
    }
    addLike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const post = yield postModel_1.default.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
            return (_b = (_a = post === null || post === void 0 ? void 0 : post.likes) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        });
    }
    removeLike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const post = yield postModel_1.default.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
            return (_b = (_a = post === null || post === void 0 ? void 0 : post.likes) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        });
    }
    removePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedPost = yield postModel_1.default.findByIdAndDelete(postId);
            yield commentModel_1.default.deleteMany({ postId });
            return deletedPost;
        });
    }
    editPost(postId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postModel_1.default.findByIdAndUpdate(postId, {
                $set: {
                    text,
                },
            }, { new: true });
            return post;
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postModel_1.default.find().populate({
                path: "tradesmanId",
                select: "name profile",
            });
            console.log(posts);
            return posts;
        });
    }
}
exports.default = PostRepository;
//# sourceMappingURL=postRepository.js.map