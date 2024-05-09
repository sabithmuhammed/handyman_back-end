import User from "../domain/user";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ROLES from "../infrastructure/constants/roles";
import UserRepository from "../infrastructure/repository/userRepository";
import Encrypt from "../infrastructure/utils/hashPassword";
import JwtCreate from "../infrastructure/utils/jwtCreate";

export default class UserUsecase {
    constructor(
        private userRepository: UserRepository,
        private encrypt: Encrypt,
        private jwtCreate: JwtCreate
    ) {}

    async saveUser(user: User) {
        const hashedPassword = await this.encrypt.createHash(
            user.password as string
        );
        user.password = hashedPassword;
        const userSave = await this.userRepository.save(user);
        return {
            status: STATUS_CODES.CREATED,
            data: {
                name: userSave.name,
                email: userSave.email,
                isTradesman: userSave.isTradesman,
            },
        };
    }

    async loginUser(email: string, password: string) {
        const userFound = await this.userRepository.findByEmail(email);
        if (userFound) {
            if (userFound.isBlocked) {
                return {
                    status: STATUS_CODES.FORBIDDEN,
                    data: "You have been blocked by admin",
                };
            }
            if (userFound.isGoogle) {
                return {
                    status: STATUS_CODES.CONFLICT,
                };
            }
            const passMatch = await this.encrypt.compare(
                password,
                userFound.password as string
            );
            if (passMatch) {
                const accessToken = this.jwtCreate.generateAccessToken(
                    userFound._id as string,
                    ROLES.USER
                );
                const refreshToken = this.jwtCreate.generateRefreshToken(
                    userFound._id as string,
                    ROLES.USER
                );
                return {
                    status: STATUS_CODES.OK,
                    data: {
                        userData: {
                            name: userFound.name,
                            email: userFound.email,
                            isTradesman: userFound.isTradesman,
                        },
                        accessToken,
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
    async handleSocialLogin(email: string, name: string) {
        let userFound = await this.userRepository.findByEmail(email);
        if (!userFound) {
            userFound = await this.userRepository.save({
                email,
                name,
                isGoogle: true,
            });
        }
        if (userFound?.isGoogle) {
            const accessToken = this.jwtCreate.generateAccessToken(
                userFound._id as string,
                ROLES.USER
            );
            const refreshToken = this.jwtCreate.generateRefreshToken(
                userFound._id as string,
                ROLES.USER
            );
            return {
                status: STATUS_CODES.OK,
                data: {
                    userData: {
                        name: userFound.name,
                        email: userFound.email,
                        isTradesman: userFound.isTradesman,
                    },
                    accessToken,
                },
                refreshToken,
            };
        }
        return {
            status: STATUS_CODES.UNAUTHORIZED,
            data: "No account found associated with this google account. Try normal login",
        };
    }

    async emailExistCheck(email: string) {
        const userFound = await this.userRepository.findByEmail(email);
        return {
            status: STATUS_CODES.CONFLICT,
            data: userFound,
        };
    }
}
