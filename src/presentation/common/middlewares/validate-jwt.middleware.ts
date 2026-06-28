import { NextFunction, Request, Response } from "express"
import { JWT } from "../../../domain/auth/gateways/jwt.gateway"
import { CustomError } from "../../../domain/common/custom-error";
import { UserService } from "../../user/user.service";

export class ValidateJWT {

    constructor(private readonly jwt: JWT, private readonly userService: UserService) { }

    validate = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw CustomError.Unauthorized(`Token is not present in the request's headers`)
        }
        const payload = this.jwt.verifyJWT(token);
        const user = await this.userService.getUserById(payload.sub)
        req.user = user;
        next()
    }
}