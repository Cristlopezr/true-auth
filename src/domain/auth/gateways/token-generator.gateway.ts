export interface TokenGenerator {
    hashToken(token: string): string;
    generateToken(): string;
}