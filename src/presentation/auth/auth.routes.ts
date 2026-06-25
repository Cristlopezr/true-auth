import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthMongoRepositoryImplementation } from "../../infrastructure/repositories/auth-mongo-impl.repository";

export class AuthRoutes {

    static get routes() {

        const router = Router();
        const authRepository = new AuthMongoRepositoryImplementation();
        const authService = new AuthService(authRepository)
        //new middleware, inyectarle el service si es necesario
        const authController = new AuthController(authService);

        //usar en la ruta
        router.get('/login', authController.login)
        router.get('/register', authController.register)
        router.get('/refresh', authController.refreshToken)

        return router;
    }
}