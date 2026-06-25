import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {

    constructor(private readonly authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        const message = await this.authService.login()

        res.status(200).json({ ok: message })
    }

    register = async (req: Request, res: Response) => {
        const message = await this.authService.register()
        res.status(200).json({ ok: message })
    }

    refreshToken = async (req: Request, res: Response) => {
        const message = await this.authService.refreshToken()
        res.status(200).json({ ok: message })
    }


}