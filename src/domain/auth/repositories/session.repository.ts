import { SessionRecord } from "../models/session.record"

export interface SessionRepository {
    getSession(token: string): Promise<SessionRecord | null>
    createSession(token: string, expiresAt: Date, userId: string): Promise<void>
    revokeSession(token: string, revokedAt: Date): Promise<SessionRecord | null>
    revokeAllSessions(userId: string, revokedAt: Date): Promise<void>
}