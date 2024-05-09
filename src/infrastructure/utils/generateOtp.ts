import { OTP_STRING } from "../constants/constants";

 export default class GenerateOtp {
    async generateOtp(length: number): Promise<string> {
        const numericCharecters = OTP_STRING;
        let otp = "";
        for (let i = 0; i < length; i++) {
            const randIndex = Math.floor(
                Math.random() * numericCharecters.length
            );
            otp += numericCharecters[randIndex];
        }
        return otp;
    }
}


