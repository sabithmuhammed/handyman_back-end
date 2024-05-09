import OtpModel from "../database/otpModel";
import OtpRepositoryInterface from "../../use_case/interface/otpRepositoryInterface";

export default class OtpRepository implements OtpRepositoryInterface {
    async storeOtp(email: string, otp: string): Promise<any> {
        await OtpModel.findOneAndUpdate(
            { email },
            { $set: { otp } },
            { upsert: true }
        );
    }
    async retrieveOtp(email: string): Promise<any> {
        const otpData = await OtpModel.findOne({ email });
        if (otpData) {
            return otpData.otp;
        } else {
            return null;
        }
    }
    async clearOtp(email: string): Promise<any> {
        await OtpModel.findOneAndDelete({ email });
    }
}
