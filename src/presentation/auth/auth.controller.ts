import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {

    constructor(private readonly authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        const message = await this.authService.login()

        res.status(200).json({ ok: message })
    }

    register = async (req: Request, res: Response) => {
        try {
            const data = await this.authService.register(req.body)
            res.status(200).json({ data })
        } catch (error) {
            console.log(error)
            res.status(500).json('Internal server error')
        }


    }

    refreshToken = async (req: Request, res: Response) => {
        const message = await this.authService.refreshToken()
        res.status(200).json({ ok: message })
    }


}