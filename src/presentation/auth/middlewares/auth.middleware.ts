import { NextFunction, Request, Response } from "express"
import { JWT } from "../../../domain/auth/gateways/jwt.gateway"
import { CustomError } from "../../../domain/common/custom-error";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../../domain/user/entities/user.entity";

export class AuthMiddleware {

    constructor(private readonly jwt: JWT, private readonly userService: UserService) { }

    validateJWT = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw CustomError.Unauthorized(`Token is not present in the request's headers`)

        const payload = this.jwt.verifyJWT(token);
        const user = await this.userService.getUserById(payload.sub)

        if (!user.isActive) throw CustomError.Unauthorized('User is inactive.');

        req.user = user;
        next()
    }

    requireVerifiedEmail = (req: Request, res: Response, next: NextFunction) => {
        this.assertValidUser(req);
        next()
    }

    requireRoles = (roles: string[]) => {
        //Validation when starting the app
        if (!roles || roles.length === 0) throw new Error('middleware requireRoles needs at least one role.')
        return (req: Request, res: Response, next: NextFunction) => {
            this.assertValidUser(req);
            if (!req.user.roles.some((role) => roles.includes(role))) throw CustomError.Forbidden('User does not have the necessary role.');
            next()
        }
    }

    private assertValidUser(req: Request): asserts req is Request & { user: UserEntity } {
        if (!req.user) throw CustomError.BadRequest('User not present in the request.');
        if (!req.user.isEmailValidated) throw CustomError.Unauthorized('Email not validated.');
    }
}