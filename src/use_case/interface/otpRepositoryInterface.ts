export default interface OtpRepositoryInterface {
    storeOtp(email: string, otp: string): Promise<any>;
    retrieveOtp(email: string): Promise<any>;
    clearOtp(email: string): Promise<any>;
}
