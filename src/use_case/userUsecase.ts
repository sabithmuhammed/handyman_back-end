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
                            profile: userFound?.profile || "",
                            userId: userFound._id,
                        },
                        accessToken,
                        isAdmin: false,
                    },
                    refreshToken,
                };
            }
        }
        return {
            status: STATUS_CODES.BAD_REQUEST,
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
                        userId: userFound._id,
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

    async changePassword(email: string, password: string) {
        const hashedPassword = await this.encrypt.createHash(password);
        const userUpdate = await this.userRepository.updatePassword(
            email,
            hashedPassword
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

    async getUserById(id: string) {
        const userFound = await this.userRepository.findById(id);
        if (userFound) {
            return {
                status: STATUS_CODES.OK,
                data: userFound,
            };
        }
        return {
            status: STATUS_CODES.NOT_FOUND,
            data: "User not found",
        };
    }
    async toggleBlock(userId: string, status: boolean) {
        const user = await this.userRepository.toggleBlock(userId, status);
        if (user) {
            return {
                status: STATUS_CODES.OK,
                data: {
                    status: "success",
                },
            };
        }
    }

    async getUsers(page: string | undefined, pageSize: string | undefined) {
        const data = await this.userRepository.getAllUsers(page, pageSize);
        return {
            status: STATUS_CODES.OK,
            data,
        };
    }

    async updateUserProfile(id: string, name: string, profile: string) {
        const userInfo = await this.userRepository.updateProfile(
            id,
            name,
            profile
        );
        return {
            status: STATUS_CODES.OK,
            data: {
                userData: {
                    name: userInfo.name,
                    email: userInfo.email,
                    isTradesman: userInfo.isTradesman,
                    profile: userInfo?.profile || "",
                    userId: userInfo._id,
                },
            },
        };
    }

    async changeUserToTradesman(id: string) {
        const result = await this.userRepository.ChangeUserToTradesman(id);
        if (result) {
            return {
                status: STATUS_CODES.OK,
                data: {
                    userData: {
                        name: result.name,
                        email: result.email,
                        isTradesman: result.isTradesman,
                        profile: result?.profile || "",
                        userId: result._id,
                    },
                },
            };
        }
        return {
            status: STATUS_CODES.NOT_FOUND,
            data: "User not found",
        };
    }
}
