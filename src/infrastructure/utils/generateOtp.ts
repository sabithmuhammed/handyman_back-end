
 export default class GenerateOtp {
    async generateOtp(length: number): Promise<string> {
        const numericCharecters = process.env.OTP_STRING as string;
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


