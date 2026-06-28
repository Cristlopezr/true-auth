import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserDto } from "../../domain/user/dto/user.dto";

export class AuthController {

    constructor(private readonly authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        const data = await this.authService.login(req.body)
        res.status(200).json({
            user: UserDto.fromEntity(data.user),
            token: data.token
        })
    }

    register = async (req: Request, res: Response) => {
        const data = await this.authService.register(req.body)
        res.status(200).json({
            user: UserDto.fromEntity(data.user),
            token: data.token
        })
    }

    refreshToken = async (req: Request, res: Response) => {

    }
}