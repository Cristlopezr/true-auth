import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthMongoRepositoryImplementation } from "../../infrastructure/repositories/auth-mongo-impl.repository";
import { CreateUserDtoImpl } from "./dto/create-user-impl.dto";
import { DtoValidator } from "../../infrastructure/middlewares/dto-validator.middleware";

export class AuthRoutes {

    static get routes() {

        const router = Router();
        const authRepository = new AuthMongoRepositoryImplementation();
        const authService = new AuthService(authRepository)
        const authController = new AuthController(authService);

        router.get('/login', authController.login)
        //Validate with zod
        router.post('/register', [DtoValidator.validate(CreateUserDtoImpl, "body")], authController.register)
        router.get('/refresh', authController.refreshToken)

        return router;
    }
}