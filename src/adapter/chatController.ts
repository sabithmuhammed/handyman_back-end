import { Req, Res, Next } from "../infrastructure/types/expressTypes";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ChatUsecase from "../use_case/chatUsecase";
import Message from "../domain/message";
// import { IFile } from "../infrastructure/middlewares/multer";
// import Cloudinary from "../infrastructure/utils/cloudinary";
// import FileOperations from "../infrastructure/utils/fileOperations";

export default class ChatController {
    constructor(
        private chatUsecase: ChatUsecase // private cloudinary: Cloudinary, // private fileOperations: FileOperations,
    ) {}

    async getAllConversations(req: Req, res: Res, next: Next) {
        try {
            const {senderId} = req.params
            const result = await this.chatUsecase.getAllConversations(senderId);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async addConversation(req: Req, res: Res, next: Next) {
        try {
            const { user1,user2, tradesman = null } = req.body;
            console.log(user1,user2);
            
            const result = await this.chatUsecase.createNewConversation(
                [user1, user2],
                tradesman
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async addMessage(req: Req, res: Res, next: Next) {
        try {
            const { receiverId,senderId, conversationId } = req.body;
            let content = req.body.text;
            const message: Message = {
                conversationId,
                message: {
                    type: "text",
                    content,
                },
                receiverId,
                senderId,
                status: "sent",
            };
            const result = await this.chatUsecase.saveNewMessage(message);
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async getAllMessages(req: Req, res: Res, next: Next) {
        try {
            const { conversationId } = req.params;
            const result = await this.chatUsecase.getAllMessages(
                conversationId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }

    async removeUnreadCount(req: Req, res: Res, next: Next) {
        try {
            const { conversationId } = req.params;
            const {receiverId} = req.body
            const result = await this.chatUsecase.removeUnreadCount(
                conversationId,receiverId
            );
            res.status(result.status).json(result.data);
        } catch (error) {
            next(error);
        }
    }
}
