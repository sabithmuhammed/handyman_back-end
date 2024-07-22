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
// import { IFile } from "../infrastructure/middlewares/multer";
// import Cloudinary from "../infrastructure/utils/cloudinary";
// import FileOperations from "../infrastructure/utils/fileOperations";
class ChatController {
    constructor(chatUsecase // private cloudinary: Cloudinary, // private fileOperations: FileOperations,
    ) {
        this.chatUsecase = chatUsecase;
    }
    getAllConversations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId } = req.params;
                const result = yield this.chatUsecase.getAllConversations(senderId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user1, user2, tradesman = null } = req.body;
                console.log(user1, user2);
                const result = yield this.chatUsecase.createNewConversation([user1, user2], tradesman);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { receiverId, senderId, conversationId } = req.body;
                let content = req.body.text;
                const message = {
                    conversationId,
                    message: {
                        type: "text",
                        content,
                    },
                    receiverId,
                    senderId,
                    status: "sent",
                };
                const result = yield this.chatUsecase.saveNewMessage(message);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { conversationId } = req.params;
                const result = yield this.chatUsecase.getAllMessages(conversationId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ChatController;
//# sourceMappingURL=chatController.js.map