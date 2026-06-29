import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserDto } from "../../domain/user/dto/user.dto";
import { SessionCookieManager } from "./utils/session-cookie-manager";

export class AuthController {

    constructor(private readonly authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        const { accessToken, refreshToken, user } = await this.authService.login(req.body)

        SessionCookieManager.set(res, refreshToken);

        res.status(200).json({
            user: UserDto.fromEntity(user),
            accessToken
        })
    }

    register = async (req: Request, res: Response) => {
        const data = await this.authService.register(req.body)
        res.status(200).json({ user: UserDto.fromEntity(data.user), message: data.message })
    }

    refreshJwtToken = async (req: Request, res: Response) => {
        const data = await this.authService.refreshJwtToken(SessionCookieManager.get(req))
        res.status(200).json({
            accessToken: data.accessToken,
            user: UserDto.fromEntity(data.user)
        })
    }

    validateEmail = async (req: Request, res: Response) => {
        const data = await this.authService.validateEmail(req.params.token as string)
        res.status(200).json({ ok: true, ...data })
    }
}