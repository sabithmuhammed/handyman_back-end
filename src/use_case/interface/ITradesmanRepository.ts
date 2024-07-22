import Tradesman from "../../domain/tradesman";

export default interface ITradesmanRepository {
    saveTradesman(tradesman: Tradesman): Promise<Tradesman>;
    findByUserId(userId: string): Promise<Tradesman | null>;
    getProfileFull(tradesmanId: string): Promise<Tradesman | null>;
    getAllPendingTradesmen(): Promise<Tradesman[] | null>;
    changeVerificationStatus(
        tradesmanId: string,
        status: VerificationType
    ): Promise<Tradesman | null>;

    getAllTradesmanWithFilter(
        page: number | undefined,
        pageSize: number | undefined,
        filters: FilterType
    ): Promise<{
        tradesmen: Tradesman[] | null;
        totalCount: number;
        page: number;
    }>;
    toggleBlock(userId: string, status: boolean): Promise<Tradesman | null>;
    findById(id: string): Promise<Tradesman | null>;
    getUniqueSkills(): Promise<string[]>;
    getAllTradesman(
        page: number | undefined,
        pageSize: number | undefined,
        filters: FilterType
    ): Promise<{
        tradesmen: Tradesman[] | null;
        totalCount: number;
        page: number;
    }>;

    updateConfiguration(tradesmanId:string,config: ConfigurationType): Promise<Tradesman | null>;
}

export type VerificationType = "pending" | "verified" | "rejected";

export type FilterType = {
    category: string;
    coordinates: [number, number];
    date: string;
};

export type ConfigurationType = {
    startingTime: string;
    endingTime: string;
    slotSize: number;
    bufferTime: number;
    workingDays: boolean[];
    services: {
        description: string;
        amount: number;
        slots: number;
    }[];
};
