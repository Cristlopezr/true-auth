import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ErrorHandler } from "../common/errors/error-handler";

export class UserController {

    constructor(private readonly userService: UserService) {
    }

    getUserById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.user!.id)
            res.status(200).json({ ok: user })
        } catch (error) {
            ErrorHandler.HandleError(res, error)
        }
    }

}