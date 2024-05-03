import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import Encrypt from "../infrastructure/utils/hashPassword";
import JwtCreate from "../infrastructure/utils/jwtCreate";

export default class UserUsecase {
    constructor(
        private userRepository: UserRepository,
        private encrypt: Encrypt,
        private jwtCreate: JwtCreate,
    ) {}

    async saveUser(user: User) {
        try {
            const hashedPassword = await this.encrypt.createHash(user.password);
            user.password = hashedPassword;
            const userSave = await this.userRepository.save(user);
            return {
                status: 200,
                data: { name: userSave.name, email: userSave.email,isTradesman:userSave.isTradesman },
            };
        } catch (error) {
            return {
                status: 400,
                data: error,
            };
        }
    }

    async emailExistCheck(email: string) {
        try {
            const userFound = await this.userRepository.findByEmail(email);
            return {
                status: 200,
                data: userFound,
            };
        } catch (error) {
            return {
                status: 400,
                data: error,
            };
        }
    }
}
