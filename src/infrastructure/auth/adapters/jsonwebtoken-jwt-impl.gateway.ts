import { JWT, JwtOptions } from "../../../domain/auth/gateways/jwt.gateway";
import jwt from 'jsonwebtoken'
export class JsonWebTokenImpl implements JWT {
    signJWT(payload: string | object, secret: string, options?: JwtOptions): string {
        return jwt.sign(payload, secret, { expiresIn: options?.expiresIn ?? '10m' })
    }

    verifyJWT<T>(token: string, secret: string, options?: JwtOptions): T {
        try {
            const payload = jwt.verify(token, secret)
            return payload as T
        } catch (error: any) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expired')
            }
            throw new Error('Invalid token')
        }
    }

}