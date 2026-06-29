import { SessionRecord } from "../models/session.record"

export interface SessionRepository {
    getSession(token: string): Promise<SessionRecord | null>
    createSession(token: string, expiresAt: Date, userId: string): Promise<void>
}