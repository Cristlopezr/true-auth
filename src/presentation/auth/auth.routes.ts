import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CreateUserDtoImpl } from "../user/dto/create-user-impl.dto";
import { DtoValidator } from "../common/middlewares/dto-validator.middleware";
import { BcryptEncrypterImpl } from "../../infrastructure/auth/adapters/bcrypt-encrypter-impl.gateway";
import { JsonWebTokenImpl } from "../../infrastructure/auth/adapters/jsonwebtoken-jwt-impl.gateway";
import { UserRepositoryPrismaImpl } from "../../infrastructure/user/repositories/user-prisma-impl.repository";
import { LoginUserDtoImpl } from "./dto/login-user-impl.dto";
import { EmailVerificationPrismaImpl } from "../../infrastructure/auth/repositories/email-verification-prisma-impl.repository";
import { CryptoVerificationTokenGeneratorImpl } from "../../infrastructure/auth/adapters/crypto-verification-token-generator-impl.gateway";
import { NodemailerEmailSenderImpl } from "../../infrastructure/common/gateways/nodemailer-email-sender-impl.gateway";
import { envs } from "../../config/envs";

export class AuthRoutes {

    static get routes() {

        const router = Router();
        const userRepository = new UserRepositoryPrismaImpl();
        const encrypter = new BcryptEncrypterImpl();
        const jwt = new JsonWebTokenImpl();
        const emailVerificationRepository = new EmailVerificationPrismaImpl();
        const verificationTokenGenerator = new CryptoVerificationTokenGeneratorImpl();
        const emailSender = new NodemailerEmailSenderImpl(envs.EMAIL_ADDRESS, envs.GMAIL_APP_PASSWORD);
        const authService = new AuthService(userRepository,
            encrypter,
            jwt,
            emailVerificationRepository,
            verificationTokenGenerator,
            emailSender);
        const authController = new AuthController(authService);

        router.post('/login', [DtoValidator.Validate(LoginUserDtoImpl, "body")], authController.login)
        router.post('/register', [DtoValidator.Validate(CreateUserDtoImpl, "body")], authController.register)
        router.post('/refresh', authController.refreshToken)
        router.get('/validateEmail/:token', authController.validateEmail)

        return router;
    }
}