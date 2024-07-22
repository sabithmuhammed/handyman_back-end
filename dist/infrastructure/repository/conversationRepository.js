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
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
class ConversationRepository {
    createConversation(members_1) {
        return __awaiter(this, arguments, void 0, function* (members, tradesmanId = null) {
            const conversation = new conversationModel_1.default({ members, tradesmanId });
            yield conversation.save();
            return conversation;
        });
    }
    addLastMessage(convoId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield conversationModel_1.default.findByIdAndUpdate(convoId, {
                $set: {
                    lastMessage: message,
                },
            }, { new: true });
            return conversation;
        });
    }
    checkExist(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield conversationModel_1.default.findOne({
                members: { $all: members },
            });
            return conversation;
        });
    }
    getAllConversation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversations = yield conversationModel_1.default.find({
                members: { $in: [userId] },
            }).sort({ updatedAt: -1 });
            return conversations;
        });
    }
}
exports.default = ConversationRepository;
//# sourceMappingURL=conversationRepository.js.map