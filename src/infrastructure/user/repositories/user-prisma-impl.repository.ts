import { prisma } from "../../../data/prisma";
import { CreateUserDto } from "../../../domain/user/dto/create-user.dto";
import { UserRecord } from "../../../domain/user/models/user.record";
import { FindUserOptions, UserRepository } from "../../../domain/user/respositories/user.repository";

export class UserRepositoryPrismaImpl implements UserRepository {

    validateEmailTransaction = async (userId: string): Promise<void> => {
        await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    isEmailValidated: true
                }
            }),
            prisma.userToken.deleteMany({
                where: {
                    userId: userId,
                    type: 'EMAIL_VERIFICATION'
                }
            })
        ])
    }

    resetPasswordTransaction = async (userId: string, hashedPassword: string): Promise<void> => {
        await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    password: hashedPassword
                }
            }),
            prisma.userToken.deleteMany({
                where: {
                    userId: userId,
                    type: 'PASSWORD_RESET'
                }
            })
        ])
    }

    //If findUserOptions = undefined => getsAll
    findUserById = async (id: string, options?: FindUserOptions): Promise<UserRecord | null> => {
        return await prisma.user.findFirst({
            where: {
                id,
                isEmailValidated: options?.isEmailValidated,
                isActive: options?.isActive
            }
        })
    }

    findUserByEmail = async (email: string, options?: FindUserOptions): Promise<UserRecord | null> => {
        return await prisma.user.findFirst({
            where: {
                email,
                isEmailValidated: options?.isEmailValidated,
                isActive: options?.isActive
            }
        })
    }

    createUser = async (createUserDto: CreateUserDto): Promise<UserRecord> => {
        return await prisma.user.create({
            data: createUserDto
        })
    }
}