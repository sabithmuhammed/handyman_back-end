import Conversation from "../domain/conversation";
import Message from "../domain/message";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ConversationRepository from "../infrastructure/repository/conversationRepository";
import MessageRepository from "../infrastructure/repository/messageRepository";

export default class ChatUsecase {
    constructor(
        private conversationRepository: ConversationRepository,
        private messasgeRepository: MessageRepository
    ) {}
    async createNewConversation(
        members: [string, string],
        tradesmanId: string | null = null
    ) {
        let conversation = await this.conversationRepository.checkExist(
            members
        );
        if (!conversation) {
            conversation = await this.conversationRepository.createConversation(
                members,
                tradesmanId
            );
        }
        return {
            status: STATUS_CODES.OK,
            data: conversation,
        };
    }

    async getAllConversations(userId: string) {
        const conversations =
            await this.conversationRepository.getAllConversation(userId);
        return {
            status: STATUS_CODES.OK,
            data: conversations,
        };
    }

    async saveNewMessage(message: Message) {
        const newMessage = await this.messasgeRepository.saveNewMessage(
            message
        );
        const conversation = await this.conversationRepository.addLastMessage(
            newMessage.conversationId as unknown as string,
            newMessage.message.content
        );
        return {
            status: STATUS_CODES.OK,
            data: conversation,
        };
    }

    async getAllMessages(conversationId: string) {
        const messages = await this.messasgeRepository.getAllMessages(
            conversationId
        );

        return {
            status: STATUS_CODES.OK,
            data: messages,
        };
    }
}
