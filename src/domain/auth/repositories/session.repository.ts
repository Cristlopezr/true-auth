export interface SessionRepository {
    findTokenByUserId(): Promise<string>
    createSession(token: string, expiresAt: Date, userId: string): Promise<void>
}