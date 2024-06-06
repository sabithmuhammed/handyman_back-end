import Tradesman from "../domain/tradesman";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ROLES from "../infrastructure/constants/roles";
import TradesmanRepository from "../infrastructure/repository/tradesmanRepository";
import JwtCreate from "../infrastructure/utils/jwtCreate";
import { VerificationType } from "./interface/ITradesmanRepository";

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
                return {
                    status: STATUS_CODES.OK,
                    data: {
                        status: "Verified",
                    },
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
                    status: "pending",
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
        const tradesmen = await this.tradesmanRepository.getASllPending();

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

    async getTradesmen(page: string | undefined, pageSize: string| undefined) {
        const data = await this.tradesmanRepository.getAllTradesman(
            page,
            pageSize
        );
        return {
            status: STATUS_CODES.OK,
            data,
        };
    }
    async toggleBlock(userId:string,status:boolean){
        const tradesman = await this.tradesmanRepository.toggleBlock(userId,status);
        if(tradesman){
            return {
                status:STATUS_CODES.OK,
                data:{
                    status:"success"
                }
            }
        }
    }
    async getAllSkills(){
        const result = await this.tradesmanRepository.getUniqueSkills()
        return {
            status:STATUS_CODES.OK,
            data:result
        }
    }
}
