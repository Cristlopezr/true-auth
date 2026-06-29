import { prisma } from "../../../data/prisma";
import { EmailVerificationRecord } from "../../../domain/auth/models/email-verification.record";
import { EmailVerificationRepository } from "../../../domain/auth/repositories/email-verification.repository";

export class EmailVerificationPrismaImpl implements EmailVerificationRepository {
    createToken = async (userId: string, token: string, expiresAt: Date) => {
        await prisma.emailVerification.create({
            data: {
                token,
                userId,
                expiresAt
            }
        })
    }
    findToken = async (token: string): Promise<EmailVerificationRecord | null> => {
        return await prisma.emailVerification.findFirst({
            where: {
                token,
                AND: {
                    expiresAt: {
                        gt: new Date()
                    }
                }
            }
        })
    }

    deleteTokenByUserId = async (userId: string) => {
        await prisma.emailVerification.deleteMany({
            where: {
                userId
            }
        })
    }
}