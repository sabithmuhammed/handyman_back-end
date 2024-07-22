import express from "express";
import { Req, Res, Next } from "../types/expressTypes";
import ChatController from "../../adapter/chatController";
import ChatUsecase from "../../use_case/chatUsecase";
import MessageRepository from "../repository/messageRepository";
import ConversationRepository from "../repository/conversationRepository";
import userAuth from "../middlewares/userAuth";

const chatRouter = express.Router();

const messageRepository = new MessageRepository();
const conversationRepository = new ConversationRepository();
const chatUsecase = new ChatUsecase(conversationRepository, messageRepository);
const chatController = new ChatController(chatUsecase);

chatRouter.get(
    "/get-conversations/:senderId",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        chatController.getAllConversations(req, res, next)
);

chatRouter.post(
    "/add-conversation",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        chatController.addConversation(req, res, next)
);

chatRouter.post(
    "/save-message",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        chatController.addMessage(req, res, next)
);

chatRouter.get(
    "/get-messages/:conversationId",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        chatController.getAllMessages(req, res, next)
);

chatRouter.patch(
    "/remove-unread/:conversationId",
    userAuth,
    (req: Req, res: Res, next: Next) =>
        chatController.removeUnreadCount(req, res, next)
);


export default chatRouter;
