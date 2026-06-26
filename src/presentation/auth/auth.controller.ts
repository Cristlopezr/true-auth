import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {

    constructor(private readonly authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        const message = await this.authService.login()

        res.status(200).json({ ok: message })
    }

    register = async (req: Request, res: Response) => {
        const user = await this.authService.register(req.body)

        //UserDto.toJSON()
        res.status(200).json({ ok: user })
    }

    refreshToken = async (req: Request, res: Response) => {
        const message = await this.authService.refreshToken()
        res.status(200).json({ ok: message })
    }


}