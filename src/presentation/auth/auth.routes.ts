import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthMongoRepositoryImplementation } from "../../infrastructure/repositories/auth-mongo-impl.repository";
import { CreateUserDtoImpl } from "./dto/create-user-impl.dto";
import { DtoValidator } from "../middlewares/dto-validator.middleware";
import { BcryptEncrypterImpl } from "../../infrastructure/adapters/bcrypt-encrypter-impl.gateway";

export class AuthRoutes {

    static get routes() {

        const router = Router();
        const authRepository = new AuthMongoRepositoryImplementation();
        const encrypter = new BcryptEncrypterImpl();
        const authService = new AuthService(authRepository, encrypter);
        const authController = new AuthController(authService);

        router.post('/login', authController.login)
        //Validate with zod
        router.post('/register', [DtoValidator.validate(CreateUserDtoImpl, "body")], authController.register)
        router.post('/refresh', authController.refreshToken)

        return router;
    }
}