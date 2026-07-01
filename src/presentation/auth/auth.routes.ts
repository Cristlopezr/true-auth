import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CreateUserDtoImpl } from "../user/dto/create-user-impl.dto";
import { DtoValidator } from "../common/middlewares/dto-validator.middleware";
import { BcryptEncrypterImpl } from "../../infrastructure/auth/adapters/bcrypt-encrypter-impl.gateway";
import { JsonWebTokenImpl } from "../../infrastructure/auth/adapters/jsonwebtoken-jwt-impl.gateway";
import { UserRepositoryPrismaImpl } from "../../infrastructure/user/repositories/user-prisma-impl.repository";
import { LoginUserDtoImpl } from "./dto/login-user-impl.dto";
import { UserTokenPrismaImpl } from "../../infrastructure/auth/repositories/user-token-prisma-impl.repository";
import { CryptoTokenGeneratorImpl } from "../../infrastructure/auth/adapters/crypto-token-generator-impl.gateway";
import { NodemailerEmailSenderImpl } from "../../infrastructure/common/gateways/nodemailer-email-sender-impl.gateway";
import { envs } from "../../config/envs";
import { SessionPrismaRepositoryImpl } from "../../infrastructure/auth/repositories/session-prisma-impl.repository";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { UserService } from "../user/user.service";

export class AuthRoutes {

    static get routes() {

        const router = Router();
        const userRepository = new UserRepositoryPrismaImpl();
        const encrypter = new BcryptEncrypterImpl();
        const jwt = new JsonWebTokenImpl();
        const userTokenRepository = new UserTokenPrismaImpl();
        const tokenGenerator = new CryptoTokenGeneratorImpl();
        const userService = new UserService(userRepository);
        const authMiddleware = new AuthMiddleware(jwt, userService);
        const emailSender = new NodemailerEmailSenderImpl(envs.EMAIL_ADDRESS, envs.GMAIL_APP_PASSWORD);
        const sessionRepository = new SessionPrismaRepositoryImpl();
        const authService = new AuthService(userRepository,
            encrypter,
            jwt,
            userTokenRepository,
            tokenGenerator,
            emailSender,
            sessionRepository);
        const authController = new AuthController(authService);

        router.post('/login', [DtoValidator.Validate(LoginUserDtoImpl, "body")], authController.login)
        router.post('/register', [DtoValidator.Validate(CreateUserDtoImpl, "body")], authController.register)
        router.post('/refresh', authController.refreshJwtToken)
        router.post('/logout', [authMiddleware.validateJWT], authController.logout)
        router.post('/delete-all-sessions', [authMiddleware.validateJWT], authController.deleteAllSessions)
        //Could be get if we are using direct link to backend in the email
        //Post (frontend link in the email -> frontend makes request to validate-email with token in body)
        router.post('/validate-email', authController.validateEmail)
        router.post('/forgot-password', authController.forgotPassword)
        router.post('/validate-reset-password-token', authController.validateResetPasswordToken)
        router.post('/reset-password', authController.resetPassword)
        return router;
    }
}