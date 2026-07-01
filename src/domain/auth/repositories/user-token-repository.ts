import { TokenType, UserTokenRecord } from "../models/user-token.record"

export interface UserTokenRepository {
    createToken(userId: string, token: string, type: TokenType, expiresAt: Date): Promise<void>
    findToken(token: string, type: TokenType): Promise<UserTokenRecord | null>
    deleteTokenByUserId(userId: string, type: TokenType): Promise<void>
}