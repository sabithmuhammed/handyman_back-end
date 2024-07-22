"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = __importDefault(require("../../adapter/chatController"));
const chatUsecase_1 = __importDefault(require("../../use_case/chatUsecase"));
const messageRepository_1 = __importDefault(require("../repository/messageRepository"));
const conversationRepository_1 = __importDefault(require("../repository/conversationRepository"));
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const chatRouter = express_1.default.Router();
const messageRepository = new messageRepository_1.default();
const conversationRepository = new conversationRepository_1.default();
const chatUsecase = new chatUsecase_1.default(conversationRepository, messageRepository);
const chatController = new chatController_1.default(chatUsecase);
chatRouter.get("/get-conversations/:senderId", userAuth_1.default, (req, res, next) => chatController.getAllConversations(req, res, next));
chatRouter.post("/add-conversation", userAuth_1.default, (req, res, next) => chatController.addConversation(req, res, next));
chatRouter.post("/save-message", userAuth_1.default, (req, res, next) => chatController.addMessage(req, res, next));
chatRouter.get("/get-messages/:conversationId", userAuth_1.default, (req, res, next) => chatController.getAllMessages(req, res, next));
exports.default = chatRouter;
//# sourceMappingURL=chatRoute.js.map