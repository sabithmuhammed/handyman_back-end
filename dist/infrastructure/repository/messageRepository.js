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
const messageModel_1 = __importDefault(require("../database/messageModel"));
class MessageRepository {
    saveNewMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new messageModel_1.default(message);
            yield newMessage.save();
            return newMessage;
        });
    }
    getAllMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield messageModel_1.default.find({ conversationId });
            return messages;
        });
    }
}
exports.default = MessageRepository;
//# sourceMappingURL=messageRepository.js.map