import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ErrorHandler } from "../common/errors/error-handler";

export class AuthController {

    constructor(private readonly authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        try {
            const data = await this.authService.login("test@test1.com", "123ABCabc")
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            ErrorHandler.HandleError(res, error)
        }

    }

    register = async (req: Request, res: Response) => {
        try {
            const data = await this.authService.register(req.body)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            ErrorHandler.HandleError(res, error)
        }


    }

    refreshToken = async (req: Request, res: Response) => {
        const message = await this.authService.refreshToken()
        res.status(200).json({ ok: message })
    }


}