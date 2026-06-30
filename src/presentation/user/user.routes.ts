import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepositoryPrismaImpl } from "../../infrastructure/user/repositories/user-prisma-impl.repository";
import { AuthMiddleware } from "../auth/middlewares/auth.middleware";
import { JsonWebTokenImpl } from "../../infrastructure/auth/adapters/jsonwebtoken-jwt-impl.gateway";

export class UserRoutes {

    static get routes() {
        const router = Router();

        const userRepository = new UserRepositoryPrismaImpl()
        const userService = new UserService(userRepository)
        const userController = new UserController(userService)
        const jwt = new JsonWebTokenImpl()
        const authMiddleware = new AuthMiddleware(jwt, userService)

        router.get('/profile', [authMiddleware.validateJWT, authMiddleware.requireVerifiedEmail], userController.getUserById)
        /* router.get('/admintest', [authMiddleware.requireRoles(['ADMIN'])]) */
        return router;
    }

}