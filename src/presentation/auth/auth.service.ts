import { CONSTANTS } from "../../config/constants";
import { CreateUserDto } from "../../domain/user/dto/create-user.dto";
import { PasswordEncrypter } from "../../domain/auth/gateways/password-encrypter.gateway";
import { JWT } from "../../domain/auth/gateways/jwt.gateway";
import { CustomError } from "../../domain/common/custom-error";
import { UserRepository } from "../../domain/user/respositories/user.repository";
import { LoginUserDto } from "../../domain/auth/dto/login-user.dto";
import { UserEntity } from "../../domain/user/entities/user.entity";
import { EmailVerificationRepository } from "../../domain/auth/repositories/email-verification.repository";
import { VerificationTokenGenerator } from "../../domain/auth/gateways/verification-token-generator.gateway";

export class AuthService {

    constructor(private readonly userRepository: UserRepository,
        private readonly passwordEncrypter: PasswordEncrypter,
        private readonly jwt: JWT,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly verificationTokenGenerator: VerificationTokenGenerator
    ) { }

    login = async (loginUserDto: LoginUserDto) => {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw CustomError.Unauthorized('Invalid credentials');

        const passwordMatch = await this.passwordEncrypter.comparePassword(password, user.password);

        if (!passwordMatch) throw CustomError.Unauthorized('Invalid credentials');

        const token = this.jwt.signJWT({ sub: user.id });

        return { user: UserEntity.fromRecord(user), token };
    }

    register = async (createUserDto: CreateUserDto) => {
        const userExists = await this.userRepository.findByEmail(createUserDto.email);
        if (userExists) throw CustomError.BadRequest('User email already registered');

        const hashedPassword = await this.passwordEncrypter.hashPassword(createUserDto.password, CONSTANTS.SALT_ROUNDS)
        const user = await this.userRepository.createUser({ ...createUserDto, password: hashedPassword });

        await this.sendVerificationEmail(user.id);
        return {
            message: 'A verification email has been sent to your email address'
        }
    }

    validateEmail = async (token: string) => {
        const hashedToken = this.verificationTokenGenerator.hashToken(token);
        const tokenData = await this.emailVerificationRepository.findToken(hashedToken);
        if (!tokenData) throw CustomError.BadRequest('Invalid or expired verification token.');
        //Updatear user email validated true
        //Eliminar token
        //Transaction?
        return tokenData
    }

    refreshToken = () => {
    }

    sendVerificationEmail = async (userId: string) => {
        await this.emailVerificationRepository.deleteTokenByUserId(userId);
        const plainToken = this.verificationTokenGenerator.generateToken();
        const hashedToken = this.verificationTokenGenerator.hashToken(plainToken);

        await this.emailVerificationRepository.createToken(userId, hashedToken);
        //Enviar mail
        //Responder al front
    }

}