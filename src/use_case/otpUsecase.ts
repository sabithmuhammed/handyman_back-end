import Otp from "../domain/otp";
import { OTP_TIMER } from "../infrastructure/constants/constants";
import OtpRepository from "../infrastructure/repository/otpRepository";
import Encrypt from "../infrastructure/utils/hashPassword";

export default class OtpUsecase {
    constructor(
        private otpRepository: OtpRepository,
        private encrypt: Encrypt
    ) {}

    async saveOtp({ email, otp }: Otp) {
        try {
            const hashedOtp = await this.encrypt.createHash(otp);
            await this.otpRepository.storeOtp(email, hashedOtp);
            setTimeout(async ()=>{
                await this.otpRepository.clearOtp(email);
            },OTP_TIMER)
            return {
                status: "success",
            };
        } catch (error) {
            return {
                status: "failed",
                error,
            };
        }
    }

    async compareOtp({ email, otp }: Otp) {
        try {
            const hashedOtp = await this.otpRepository.retrieveOtp(email);
            const compare = await this.encrypt.compare(otp, hashedOtp);
            return {
                status: "success",
                data: compare,
            };
        } catch (error) {
            return {
                status: "failed",
                error,
            };
        }
    }

    async removeOtp(email: string) {
        try {
            await this.otpRepository.clearOtp(email);
            return {
                status: "success",
            };
        } catch (error) {
            return {
                status: "failed",
                error,
            };
        }
    }
}
