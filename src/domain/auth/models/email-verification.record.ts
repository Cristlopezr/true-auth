export type EmailVerificationRecord = {
    token: string;
    expiresAt: Date;
    createdAt: Date;
    userId: string;
}