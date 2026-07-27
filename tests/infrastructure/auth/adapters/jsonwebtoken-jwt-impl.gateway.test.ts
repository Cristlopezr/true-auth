import jwt from 'jsonwebtoken'
import { JsonWebTokenImpl } from '../../../../src/infrastructure/auth/adapters/jsonwebtoken-jwt-impl.gateway';
import { envs } from '../../../../src/config/envs';
import { CustomError } from '../../../../src/domain/common/custom-error';

describe('jsonwebtoken-jwt-impl.gateway', () => {

    const jsonWebTokenImpl = new JsonWebTokenImpl();

    it('signJWT should call jwt.sign with correct arguments and return the token', () => {

        const payload = {
            id: '123ABC'
        }
        const options = {
            expiresIn: 10
        }
        const signedTokenValue = '802134uob'

        const jwtSignSpy = jest.spyOn(jwt, 'sign').mockReturnValue(signedTokenValue as never);
        const signedToken = jsonWebTokenImpl.signJWT(payload, options);

        expect(jwtSignSpy).toHaveBeenCalledWith(payload, envs.JWT_SECRET, options);
        expect(signedToken).toBe(signedTokenValue);
    })

    it('signJWT should call jwt.sign with default expiresIn', () => {

        const payload = {
            id: '123ABC'
        }
        const jwtSignSpy = jest.spyOn(jwt, 'sign');
        jsonWebTokenImpl.signJWT(payload);
        expect(jwtSignSpy).toHaveBeenCalledWith(payload, envs.JWT_SECRET, { expiresIn: "10m" })
    })

    it('verifyJwt should call jwt.verify with correct arguments', () => {

        const token = '123abc';
        const payloadValue = { sub: 'userId' }
        const jwtVerifySpy = jest.spyOn(jwt, 'verify').mockReturnValue(payloadValue as never)

        const payload = jsonWebTokenImpl.verifyJWT(token);

        expect(jwtVerifySpy).toHaveBeenCalledWith(token, envs.JWT_SECRET);
        expect(payload).toBe(payloadValue)
    })

    it('verifyJwt should throw CustomError when token is expired', () => {
        const expiredJwt = jwt.sign({ id: '123' }, envs.JWT_SECRET, { expiresIn: '0s' });
        expect(() => jsonWebTokenImpl.verifyJWT(expiredJwt)).toThrow(CustomError.Unauthorized('Access token expired'))
    })

    it('verifyJwt should throw CustomError when token is invalid', () => {
        expect(() => jsonWebTokenImpl.verifyJWT('123abc')).toThrow(CustomError.Unauthorized('Invalid access token'))
    })

})