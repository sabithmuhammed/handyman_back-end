import Message from "../../domain/message";
import IMessageRepository from "../../use_case/interface/IMessageRepository";
import MessageModel from "../database/messageModel";

export default class MessageRepository implements IMessageRepository {
    async saveNewMessage(message: Message): Promise<Message> {
        const newMessage = new MessageModel(message);
        await newMessage.save();
        return newMessage;
    }

    async getAllMessages(conversationId: string): Promise<Message[]> {
        const messages = await MessageModel.find({ conversationId });
        return messages;
    }
}
