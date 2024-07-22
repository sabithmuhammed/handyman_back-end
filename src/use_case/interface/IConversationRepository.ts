import Conversation from "../../domain/conversation";

export default interface IConversationRepository {
    createConversation(
        members: [string, string],
        tradesmanId: string | null
    ): Promise<Conversation>;
    checkExist(members: [string, string]): Promise<Conversation | null>;
    addLastMessage(convoId: string, message: string): Promise<Conversation>;
    getAllConversation(userId: string): Promise<Conversation[]>;
    addUnreadMessage(convoId:string,receiverId:string):Promise<Conversation | null>;
    removeUnreadMessage(convoId:string,receiverId:string):Promise<Conversation | null>;
}
