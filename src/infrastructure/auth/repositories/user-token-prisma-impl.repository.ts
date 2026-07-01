import { prisma } from "../../../data/prisma";
import { TokenType, UserTokenRecord } from "../../../domain/auth/models/user-token.record";
import { UserTokenRepository } from "../../../domain/auth/repositories/user-token-repository";

export class UserTokenPrismaImpl implements UserTokenRepository {
    createToken = async (userId: string, token: string, type: TokenType, expiresAt: Date) => {
        await prisma.userToken.create({
            data: {
                token,
                type,
                userId,
                expiresAt
            }
        })
    }
    findToken = async (token: string, type: TokenType): Promise<UserTokenRecord | null> => {
        return await prisma.userToken.findFirst({
            where: {
                token,
                type,
                expiresAt: {
                    gt: new Date()
                }
            }
        })
    }

    deleteTokenByUserId = async (userId: string) => {
        await prisma.userToken.deleteMany({
            where: {
                userId
            }
        })
    }
}