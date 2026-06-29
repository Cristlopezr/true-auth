import { VerificationTokenGenerator } from "../../../domain/auth/gateways/verification-token-generator.gateway";
import { randomBytes, createHash } from "node:crypto";


export class CryptoVerificationTokenGeneratorImpl implements VerificationTokenGenerator {

    generateToken = (): string => {
        return randomBytes(64).toString('hex');
    }

    hashToken = (token: string): string => {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }
}