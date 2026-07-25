import { CryptoTokenGeneratorImpl } from "../../../../src/infrastructure/auth/adapters/crypto-token-generator-impl.gateway"
import crypto from 'node:crypto'

describe('crypto-token-generator-impl.gateway', () => {

    const tokenGenerator = new CryptoTokenGeneratorImpl();

    it('generateToken should call crypto randomBytes and return its hex string', () => {

        const mockedHexToken = 'a1b2c3d4';
        const mockBuffer = {
            toString: jest.fn().mockReturnValue(mockedHexToken)
        }

        const randomBytesSpy = jest.spyOn(crypto, 'randomBytes').mockReturnValue(mockBuffer as never);

        const token = tokenGenerator.generateToken();

        expect(randomBytesSpy).toHaveBeenCalledWith(64);
        expect(mockBuffer.toString).toHaveBeenCalledWith('hex');
        expect(token).toBe(mockedHexToken);
    })

    it('hashToken should call createHash, update and digest with correct arguments', () => {
        const token = 'plain_token';
        const mockedHashedToken = 'hashed_token';
        const hashAlgorithm = 'sha256';

        const mockHashObject = {
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue(mockedHashedToken)
        }
        const createHashSpy = jest.spyOn(crypto, 'createHash').mockReturnValue(mockHashObject as never)

        const hashedToken = tokenGenerator.hashToken(token);

        expect(createHashSpy).toHaveBeenCalledWith(hashAlgorithm);
        expect(mockHashObject.update).toHaveBeenCalledWith(token);
        expect(mockHashObject.digest).toHaveBeenCalledWith('hex');
        expect(hashedToken).toBe(mockedHashedToken);

    })

})