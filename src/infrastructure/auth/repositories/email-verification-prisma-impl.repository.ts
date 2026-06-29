import { envs } from "../../../config/envs";
import { prisma } from "../../../data/prisma";
import { EmailVerificationRecord } from "../../../domain/auth/models/email-verification.record";
import { EmailVerificationRepository } from "../../../domain/auth/repositories/email-verification.repository";
import { DateAdapter } from "../../common/date-adapter";

export class EmailVerificationPrismaImpl implements EmailVerificationRepository {
    createToken = async (userId: string, token: string) => {
        const expirationDate = DateAdapter.addMinutes(envs.EMAIL_TOKEN_EXPIRATION_MINUTES);
        await prisma.emailVerification.create({
            data: {
                token,
                userId,
                expiresAt: expirationDate
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