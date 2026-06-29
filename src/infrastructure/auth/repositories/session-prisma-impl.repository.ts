import { prisma } from "../../../data/prisma";
import { SessionRepository } from "../../../domain/auth/repositories/session.repository";

export class SessionPrismaRepositoryImpl implements SessionRepository {
    findTokenByUserId(): Promise<string> {
        throw new Error("Method not implemented.");
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