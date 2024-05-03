 export default class GenerateOtp {
    async generateOtp(length: number): Promise<string> {
        const numericCharecters = "0123456789";
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


