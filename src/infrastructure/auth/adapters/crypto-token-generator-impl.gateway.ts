import { TokenGenerator } from "../../../domain/auth/gateways/token-generator.gateway";
import { randomBytes, createHash } from "node:crypto";


export class CryptoTokenGeneratorImpl implements TokenGenerator {

    generateToken = (): string => {
        return randomBytes(64).toString('hex');
    }

    hashToken = (token: string): string => {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }
}