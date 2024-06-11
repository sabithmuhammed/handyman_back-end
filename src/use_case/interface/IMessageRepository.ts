import Message from "../../domain/message";

export default interface IMessageRepository {
    saveNewMessage(message: Message): Promise<Message>;
    getAllMessages(conversationId: string): Promise<Message[]>;
}
