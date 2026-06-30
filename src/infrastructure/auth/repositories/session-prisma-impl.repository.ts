import { prisma } from "../../../data/prisma";
import { SessionRecord } from "../../../domain/auth/models/session.record";
import { SessionRepository } from "../../../domain/auth/repositories/session.repository";

export class SessionPrismaRepositoryImpl implements SessionRepository {

    revokeSession = async (token: string, revokedAt: Date): Promise<void> => {
        await prisma.session.update({
            where: {
                token,
                AND: {
                    isRevoked: false
                }
            },
            data: {
                isRevoked: true,
                revokedAt
            }
        })
    }
    revokeAllSessions = async (userId: string, revokedAt: Date): Promise<void> => {
        await prisma.session.updateMany({
            where: {
                userId,
                AND: {
                    isRevoked: false
                }
            },
            data: {
                isRevoked: true,
                revokedAt
            }
        })
    }

    getSession = async (token: string): Promise<SessionRecord | null> => {
        return await prisma.session.findFirst({
            where: {
                token,
                AND: {
                    isRevoked: false,
                    expiresAt: {
                        gt: new Date()
                    }
                },
            },
            include: {
                user: true
            }
        })
    }

    createSession = async (token: string, expiresAt: Date, userId: string): Promise<void> => {
        await prisma.session.create({
            data: {
                expiresAt: expiresAt,
                token: token,
                userId: userId
            }
        })
    }

}