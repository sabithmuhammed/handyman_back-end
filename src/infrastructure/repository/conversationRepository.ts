import Conversation from "../../domain/conversation";
import IConversationRepository from "../../use_case/interface/IConversationRepository";
import ConversationModel from "../database/conversationModel";

export default class ConversationRepository implements IConversationRepository {
    async createConversation(
        members: [string, string],
        tradesmanId: string | null = null
    ): Promise<Conversation> {
        const conversation = new ConversationModel({ members, tradesmanId });
        await conversation.save();
        return conversation;
    }

    async addLastMessage(
        convoId: string,
        message: string
    ): Promise<Conversation> {
        const conversation = await ConversationModel.findByIdAndUpdate(
            convoId,
            {
                $set: {
                    lastMessage: message,
                },
            },
            { new: true }
        );
        return conversation as Conversation;
    }

    async checkExist(members: [string, string]): Promise<Conversation | null> {
        const conversation = await ConversationModel.findOne({
            members: { $all: members },
        });
        return conversation;
    }
    async getAllConversation(userId: string): Promise<Conversation[]> {
        const conversations = await ConversationModel.find({
            members: { $in: [userId] },
        }).sort({ updatedAt: -1 });
        return conversations;
    }
    async addUnreadMessage(
        convoId: string,
        receiverId: string
    ): Promise<Conversation | null> {
        const conversation = await ConversationModel.findById(convoId);
        if (conversation) {
            if (conversation.unreadMessage.user == receiverId) {
                conversation.unreadMessage.count++;
            } else {
                conversation.unreadMessage.user = receiverId;
                conversation.unreadMessage.count = 1;
            }
            await conversation.save({ timestamps: false });
        }
        return conversation;
    }
    async removeUnreadMessage(
        convoId: string,
        receiverId: string
    ): Promise<Conversation | null> {
        const conversation = await ConversationModel.findById(convoId);
        if (conversation) {
            if (conversation.unreadMessage.user == receiverId) {
                conversation.unreadMessage.count = 0;
            }
            await conversation.save({ timestamps: false });
        }
        return conversation;
    }
}
