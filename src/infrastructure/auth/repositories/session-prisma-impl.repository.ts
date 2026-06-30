import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../../../data/prisma";
import { SessionRecord } from "../../../domain/auth/models/session.record";
import { SessionRepository } from "../../../domain/auth/repositories/session.repository";

export class SessionPrismaRepositoryImpl implements SessionRepository {

    //Podriamos usar el userId tambien aqui
    //No lo hice porque tendria que crear un nuevo metodo
    //Para logout con userId, para rotacion de refreshToken sin userId
    revokeSession = async (token: string, revokedAt: Date): Promise<SessionRecord | null> => {
        try {
            return await prisma.session.update({
                where: {
                    token,
                    isRevoked: false,
                    expiresAt: { gt: new Date() }
                },
                data: {
                    isRevoked: true,
                    revokedAt
                },
                include: {
                    user: true
                }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }

    }
    revokeAllSessions = async (userId: string, revokedAt: Date): Promise<void> => {
        await prisma.session.updateMany({
            where: {
                userId,
                isRevoked: false
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
                isRevoked: false,
                expiresAt: {
                    gt: new Date()
                }
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