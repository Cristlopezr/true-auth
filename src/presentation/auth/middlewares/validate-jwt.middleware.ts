import { NextFunction, Request, Response } from "express"
import { JWT } from "../../../domain/auth/gateways/jwt.gateway"
import { CustomError } from "../../../domain/common/custom-error";
import { UserService } from "../../user/user.service";

export class AuthMiddleware {

    constructor(private readonly jwt: JWT, private readonly userService: UserService) { }

    validateJWT = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw CustomError.Unauthorized(`Token is not present in the request's headers`)

        const payload = this.jwt.verifyJWT(token);
        const user = await this.userService.getUserById(payload.sub)

        if (!user.isActive) throw CustomError.Unauthorized('User inactive');

        req.user = user;
        next()
    }

    requireVerifiedEmail = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw CustomError.BadRequest('User not present in the request');
        if (!req.user.isEmailValidated) throw CustomError.Unauthorized('Email not validated')
    }

    requireRoles = (roles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) throw CustomError.BadRequest('User not present in the request');
            //Check roles
        }
    }
}