import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CreateUserDtoImpl } from "./dto/create-user-impl.dto";
import { DtoValidator } from "../common/middlewares/dto-validator.middleware";
import { BcryptEncrypterImpl } from "../../infrastructure/auth/adapters/bcrypt-encrypter-impl.gateway";
import { JsonWebTokenImpl } from "../../infrastructure/auth/adapters/jsonwebtoken-jwt-impl.gateway";
import { UserPrismaRepositoryImpl } from "../../infrastructure/user/repositories/user-prisma-impl.repository";

export class AuthRoutes {

    static get routes() {

        const router = Router();
        const userRepository = new UserPrismaRepositoryImpl();
        const encrypter = new BcryptEncrypterImpl();
        const jwt = new JsonWebTokenImpl();
        const authService = new AuthService(userRepository, encrypter, jwt);
        const authController = new AuthController(authService);

        router.post('/login', authController.login)
        //Validate with zod
        router.post('/register', [DtoValidator.Validate(CreateUserDtoImpl, "body")], authController.register)
        router.post('/refresh', authController.refreshToken)

        return router;
    }
}