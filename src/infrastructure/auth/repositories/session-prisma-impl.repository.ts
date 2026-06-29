import { prisma } from "../../../data/prisma";
import { SessionRecord } from "../../../domain/auth/models/session.record";
import { SessionRepository } from "../../../domain/auth/repositories/session.repository";

export class SessionPrismaRepositoryImpl implements SessionRepository {

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