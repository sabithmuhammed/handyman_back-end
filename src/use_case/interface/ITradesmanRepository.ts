import Tradesman, { Service, WorkingDay } from "../../domain/tradesman";

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

    updateWorkingTime(
        tradesmanId: string,
        workingDays: WorkingDay[],
        slotSize: number,
        bufferTime: number
    ): Promise<Tradesman | null>;

    addService(
        tradesmanId: string,
        service: Service
    ): Promise<Tradesman | null>;
    deleteService(
        tradesmanId: string,
        serviceId: string
    ): Promise<Tradesman | null>;
    updateService(
        tradesmanId: string,
        serviceId: string,
        service: Service
    ): Promise<Tradesman | null>;

    addLeave(
        tradesmaId: string,
        leaves: { date: string; reason: string }[]
    ): Promise<Tradesman | null>;

    removeLeave(tradesmanId: string, date: string): Promise<Tradesman | null>;

    // updateConfiguration(tradesmanId:string,config: ConfigurationType): Promise<Tradesman | null>;
}

export type VerificationType = "pending" | "verified" | "rejected";

export type FilterType = {
    category: string;
    coordinates: [number, number];
    date: string;
};
