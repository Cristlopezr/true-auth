import { JWT, JwtOptions, JwtPayload } from "../../../domain/auth/gateways/jwt.gateway";
import jwt from 'jsonwebtoken'
import { CustomError } from "../../../domain/common/custom-error";
import { envs } from "../../../config/envs";
export class JsonWebTokenImpl implements JWT {

    signJWT = (payload: string | object, options?: JwtOptions): string => {
        return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: options?.expiresIn ?? '10m' })
    }

    verifyJWT = (token: string): JwtPayload => {
        try {
            const payload = jwt.verify(token, envs.JWT_SECRET)
            return payload as JwtPayload
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw CustomError.Unauthorized('Token expired')
            }
            throw CustomError.Unauthorized('Invalid token')
        }
    }
}