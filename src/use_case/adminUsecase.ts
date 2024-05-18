import User from "../domain/user";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ROLES from "../infrastructure/constants/roles";
import AdminRepository from "../infrastructure/repository/adminRepository";
import Encrypt from "../infrastructure/utils/hashPassword";
import JwtCreate from "../infrastructure/utils/jwtCreate";

export default class AdminUsecase {
    constructor(
        private adminRepository: AdminRepository,
        private encrypt: Encrypt,
        private jwtCreate: JwtCreate
    ) {}

    async loginAdmin(email: string, password: string) {
        const userFound = await this.adminRepository.findByEmail(email);
        if (userFound) {
            
            const passMatch = await this.encrypt.compare(
                password,
                userFound.password as string
            );
            if (passMatch) {
                const accessToken = this.jwtCreate.generateAccessToken(
                    userFound._id as string,
                    ROLES.ADMIN
                );
                const refreshToken = this.jwtCreate.generateRefreshToken(
                    userFound._id as string,
                    ROLES.ADMIN
                );
                return {
                    status: STATUS_CODES.OK,
                    data: {
                        userData: {
                            name: userFound.name,
                            email: userFound.email,
                        },
                        accessToken,
                        isAdmin:true
                    },
                    refreshToken,
                };
            }
        }
        return {
            status: STATUS_CODES.UNAUTHORIZED,
            data: "Incorrect email or password",
        };
    }
    

    async emailExistCheck(email: string) {
        const userFound = await this.adminRepository.findByEmail(email);
        return {
            status: STATUS_CODES.CONFLICT,
            data: userFound,
        };
    }

    async changePassword(email: string, password: string) {
        const userUpdate = await this.adminRepository.updatePassword(
            email,
            password
        );
        if (!userUpdate) {
            return {
                status: STATUS_CODES.NOT_FOUND,
                data: "No account found",
            };
        }
        return {
            status: STATUS_CODES.OK,
            data: userUpdate,
        };
    }
}
