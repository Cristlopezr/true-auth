import { EmailVerificationRecord } from "../models/email-verification.record"

export interface EmailVerificationRepository {
    createToken(userId: string, token: string, expiresAt: Date): Promise<void>
    findToken(token: string): Promise<EmailVerificationRecord | null>
    deleteTokenByUserId(userId: string): Promise<void>
}