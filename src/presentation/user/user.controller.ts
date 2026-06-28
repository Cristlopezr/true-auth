import { Request, Response } from "express";
import { UserService } from "./user.service";
import { UserDto } from "../../domain/user/dto/user.dto";

export class UserController {

    constructor(private readonly userService: UserService) {
    }

    getUserById = async (req: Request, res: Response) => {
        const user = await this.userService.getUserById(req.user!.id)
        res.status(200).json({ user: UserDto.fromEntity(user) })
    }
}