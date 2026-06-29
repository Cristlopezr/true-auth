export interface VerificationTokenGenerator {
    hashToken(token: string): string;
    generateToken(): string;
}