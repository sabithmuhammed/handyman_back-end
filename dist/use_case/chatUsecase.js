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
class ChatUsecase {
    constructor(conversationRepository, messasgeRepository) {
        this.conversationRepository = conversationRepository;
        this.messasgeRepository = messasgeRepository;
    }
    createNewConversation(members_1) {
        return __awaiter(this, arguments, void 0, function* (members, tradesmanId = null) {
            let conversation = yield this.conversationRepository.checkExist(members);
            if (!conversation) {
                conversation = yield this.conversationRepository.createConversation(members, tradesmanId);
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: conversation,
            };
        });
    }
    getAllConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield this.conversationRepository.getAllConversation(userId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: conversations,
            };
        });
    }
    saveNewMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = yield this.messasgeRepository.saveNewMessage(message);
            const conversation = yield this.conversationRepository.addLastMessage(newMessage.conversationId, newMessage.message.content);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: newMessage,
            };
        });
    }
    getAllMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.messasgeRepository.getAllMessages(conversationId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: messages,
            };
        });
    }
}
exports.default = ChatUsecase;
//# sourceMappingURL=chatUsecase.js.map