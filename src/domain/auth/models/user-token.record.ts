export type UserTokenRecord = {
    token: string;
    type: TokenType;
    expiresAt: Date;
    createdAt: Date;
    userId: string;
}

export type TokenType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'