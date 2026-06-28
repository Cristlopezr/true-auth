export interface SessionRepository {
    findTokenByUserId(): Promise<string>
}