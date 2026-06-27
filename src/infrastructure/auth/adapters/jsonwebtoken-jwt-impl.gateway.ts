import { JWT, JwtOptions, JwtPayload } from "../../../domain/auth/gateways/jwt.gateway";
import jwt from 'jsonwebtoken'
import { CustomError } from "../../../domain/common/custom-error";
export class JsonWebTokenImpl implements JWT {

    signJWT = (payload: string | object, secret: string, options?: JwtOptions): string => {
        return jwt.sign(payload, secret, { expiresIn: options?.expiresIn ?? '10m' })
    }

    verifyJWT = (token: string, secret: string): JwtPayload => {
        try {
            const payload = jwt.verify(token, secret)
            return payload as JwtPayload
        } catch (error: any) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                throw CustomError.Unauthorized('Token expired')
            }
            throw CustomError.Unauthorized('Invalid token')
        }
    }

}