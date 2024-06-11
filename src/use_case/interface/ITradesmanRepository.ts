import Tradesman from "../../domain/tradesman";

export default interface ITradesmanRepository {
    saveTradesman(tradesman: Tradesman): Promise<Tradesman>;
    findByUserId(userId: string): Promise<Tradesman | null>;
    getASllPending(): Promise<Tradesman[] | null>;
    changeVerificationStatus(
        tradesmanId: string,
        status: VerificationType
    ): Promise<Tradesman | null>;

    getAllTradesman(
        page: string | undefined,
        pageSize: string | undefined
    ): Promise<{
        tradesmen: Tradesman[] | null;
        totalCount: number;
        page: number;
    }>;
    toggleBlock(userId: string, status: boolean): Promise<Tradesman | null>;
    findById(id: string): Promise<Tradesman | null>;
    getUniqueSkills(): Promise<string[]>;
}

export type VerificationType = "pending" | "verified" | "rejected";
