import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserPrismaRepositoryImpl } from "../../infrastructure/user/repositories/user-prisma-impl.repository";
import { ValidateJWT } from "../common/middlewares/validate-jwt.middleware";
import { JsonWebTokenImpl } from "../../infrastructure/auth/adapters/jsonwebtoken-jwt-impl.gateway";

export class UserRoutes {

    static get routes() {
        const router = Router();

        const userRepository = new UserPrismaRepositoryImpl()
        const userService = new UserService(userRepository)
        const userController = new UserController(userService)
        const jwt = new JsonWebTokenImpl()
        const validateJwt = new ValidateJWT(jwt, userService)

        router.get('/profile', [validateJwt.validate], userController.getUserById)

        return router;
    }

}