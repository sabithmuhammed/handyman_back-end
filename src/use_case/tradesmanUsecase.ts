import { config } from "dotenv";
import Tradesman from "../domain/tradesman";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ROLES from "../infrastructure/constants/roles";
import TradesmanRepository from "../infrastructure/repository/tradesmanRepository";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import { ConfigurationType, FilterType, VerificationType } from "./interface/ITradesmanRepository";

export default class TradesmanUsecase {
    constructor(
        private tradesmanRepository: TradesmanRepository,
        private jwtCreate: JwtCreate
    ) {}

    async saveTradesman(tradesman: Tradesman) {
        const newTradesman = await this.tradesmanRepository.saveTradesman(
            tradesman
        );
        return {
            status: STATUS_CODES.CREATED,
            data: {
                newTradesman,
            },
        };
    }

    async checkExistByUserId(userId: string) {
        const tradesman = await this.tradesmanRepository.findByUserId(userId);
        if (tradesman) {
            if (tradesman.verificationStatus == "verified") {
                const accessToken = this.jwtCreate.generateAccessToken(
                    tradesman._id as string,
                    ROLES.TRADESMAN
                );
                const refreshToken = this.jwtCreate.generateRefreshToken(
                    tradesman._id as string,
                    ROLES.TRADESMAN
                );
                return {
                    status: STATUS_CODES.OK,
                    data: {
                        status: "Verified",
                        data: {
                            name: tradesman.name,
                            profile: tradesman.profile,
                            accessToken,
                            tradesmanId: tradesman._id,
                        },
                    },
                    refreshToken,
                };
            } else if (tradesman.verificationStatus == "rejected") {
                return {
                    status: STATUS_CODES.OK,
                    data: {
                        status: "Rejected",
                    },
                };
            }
            return {
                status: STATUS_CODES.OK,
                data: {
                    status: "Not verified",
                },
            };
        }
        return {
            status: STATUS_CODES.OK,
            data: {
                status: "Not found",
            },
        };
    }

    async getPendingVerifications() {
        const tradesmen =
            await this.tradesmanRepository.getAllPendingTradesmen();

        return {
            status: STATUS_CODES.OK,
            data: tradesmen,
        };
    }

    async changeVerificationStatus(
        tradesmanId: string,
        status: VerificationType
    ) {
        const tradesman =
            await this.tradesmanRepository.changeVerificationStatus(
                tradesmanId,
                status
            );
        if (tradesman) {
            return {
                status: STATUS_CODES.OK,
                data: tradesman,
            };
        }
    }

    async getTradesmen(
        page: number | undefined,
        pageSize: number | undefined,
        filters: FilterType
    ) {
        const data = await this.tradesmanRepository.getAllTradesmanWithFilter(
            page,
            pageSize,
            filters
        );
        return {
            status: STATUS_CODES.OK,
            data,
        };
    }
    async toggleBlock(userId: string, status: boolean) {
        const tradesman = await this.tradesmanRepository.toggleBlock(
            userId,
            status
        );
        if (tradesman) {
            return {
                status: STATUS_CODES.OK,
                data: {
                    status: "success",
                },
            };
        }
    }
    async getAllSkills() {
        const result = await this.tradesmanRepository.getUniqueSkills();
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async getProfileMinimum(id: string) {
        let result = await this.tradesmanRepository.findById(id);
        if (result) {
            const {
                _id,
                name,
                profile,
                experience,
                location,
                category,
                reviews,
                configuration
            } = result;
            return {
                status: STATUS_CODES.OK,
                data: {
                    _id,
                    name,
                    profile,
                    experience,
                    location,
                    category,
                    reviews,
                    configuration
                },
            };
        }
        return {
            status: STATUS_CODES.OK,
            data: null,
        };
    }

    async getAllTradesmen(
        page: number | undefined,
        pageSize: number | undefined,
        filters: { category: string }
    ) {
        const data = await this.tradesmanRepository.getAllTradesman(
            page,
            pageSize,
            filters
        );
        return {
            status: STATUS_CODES.OK,
            data,
        };
    }

    async getProfileFull(tradesmanId: string) {
        const data = await this.tradesmanRepository.getProfileFull(tradesmanId);
        return {
            status: STATUS_CODES.OK,
            data,
        };
    }

    async updateConfiguration(tradesmanId: string,config:ConfigurationType) {
        const data = await this.tradesmanRepository.updateConfiguration(tradesmanId,config);
        return {
            status: STATUS_CODES.OK,
            data,
        };
    }
}
