import { CONSTANTS } from "../../config/constants";
import { CreateUserDto } from "../../domain/user/dto/create-user.dto";
import { PasswordEncrypter } from "../../domain/auth/gateways/password-encrypter.gateway";
import { JWT } from "../../domain/auth/gateways/jwt.gateway";
import { CustomError } from "../../domain/common/custom-error";
import { UserRepository } from "../../domain/user/repositories/user.repository";
import { LoginUserDto } from "../../domain/auth/dto/login-user.dto";
import { UserEntity } from "../../domain/user/entities/user.entity";
import { UserTokenRepository } from "../../domain/auth/repositories/user-token-repository";
import { TokenGenerator } from "../../domain/auth/gateways/token-generator.gateway";
import { UserRecord } from "../../domain/user/models/user.record";
import { EmailSender } from "../../domain/common/gateways/email-sender";
import { envs } from "../../config/envs";
import { SessionRepository } from "../../domain/auth/repositories/session.repository";
import { DateAdapter } from "../../infrastructure/common/date-adapter";
import { TokenType, UserTokenRecord } from "../../domain/auth/models/user-token.record";
import { HtmlTemplateAdapter } from "../../infrastructure/common/html-template-";

export class AuthService {

    constructor(private readonly userRepository: UserRepository,
        private readonly passwordEncrypter: PasswordEncrypter,
        private readonly jwt: JWT,
        private readonly userTokenRepository: UserTokenRepository,
        private readonly tokenGenerator: TokenGenerator,
        private readonly emailSender: EmailSender,
        private readonly sessionRepository: SessionRepository
    ) { }

    login = async (loginUserDto: LoginUserDto) => {
        const { email, password } = loginUserDto;

        //If use not active can't login - to let them login even so just don't send the options
        const user = await this.userRepository.findUserByEmail(email, { isActive: true });

        if (!user) throw CustomError.Unauthorized('Invalid credentials');

        const passwordMatch = await this.passwordEncrypter.comparePassword(password, user.password);

        if (!passwordMatch) throw CustomError.Unauthorized('Invalid credentials');

        const { plainToken: refreshToken, hashedToken: hashedRefreshToken } = this.generatePlainAndHashedTokens();

        const expirationDate = DateAdapter.addDays(envs.REFRESH_TOKEN_EXPIRATION_DAYS);
        await this.sessionRepository.createSession(hashedRefreshToken, expirationDate, user.id);

        const token = this.jwt.signJWT({ sub: user.id });

        return { user: UserEntity.fromRecord(user), accessToken: token, refreshToken };
    }

    register = async (createUserDto: CreateUserDto) => {
        const userExists = await this.userRepository.findUserByEmail(createUserDto.email);
        if (userExists) throw CustomError.BadRequest('User email already registered');

        const hashedPassword = await this.passwordEncrypter.hashPassword(createUserDto.password, CONSTANTS.SALT_ROUNDS)
        const user = await this.userRepository.createUser({ ...createUserDto, password: hashedPassword });

        await this.sendVerificationEmail(user);
        return {
            user: UserEntity.fromRecord(user),
            message: 'A verification email has been sent to your email address',
        }
    }

    validateEmail = async (token: string) => {
        const tokenData = await this.findUserTokenOrThrow(token, 'EMAIL_VERIFICATION');
        await this.userRepository.validateEmailTransaction(tokenData.userId);
    }

    refreshJwtToken = async (refreshToken: string) => {
        const hashedRefreshToken = this.tokenGenerator.hashToken(refreshToken)
        //Revoke Session to rotate refreshToken
        //Crear otro parametro para revoke? para separar revoke del user con revoke de refreshToken?
        const revokedSession = await this.sessionRepository.revokeSession(hashedRefreshToken, new Date());
        if (!revokedSession) throw CustomError.Unauthorized('Invalid session');
        const { user, expiresAt } = revokedSession;

        if (!user.isActive) throw CustomError.Unauthorized('User is inactive');

        // Absolute expiration: reuse original expiresAt so the session lifespan is fixed from login.
        // For sliding expiration: replace with DateAdapter.addDays(envs.REFRESH_TOKEN_EXPIRATION_DAYS)
        const { plainToken: newRefreshToken, hashedToken: newHashedRefreshToken } = this.generatePlainAndHashedTokens();
        await this.sessionRepository.createSession(newHashedRefreshToken, expiresAt, user.id);
        const accessToken = this.jwt.signJWT({ sub: user.id });
        return {
            user: UserEntity.fromRecord(user), accessToken, refreshToken: newRefreshToken, expiresAt
        }
    }

    logout = async (token: string) => {
        const hashedRefreshToken = this.tokenGenerator.hashToken(token)
        await this.sessionRepository.revokeSession(hashedRefreshToken, new Date());
    }

    deleteAllSessions = async (userId: string) => {
        await this.sessionRepository.revokeAllSessions(userId, new Date());
    }

    sendForgotPasswordEmail = async (email: string) => {
        const user = await this.userRepository.findUserByEmail(email, { isActive: true, isEmailValidated: true })
        if (!user) return;
        const plainToken = await this.createUserToken(user.id, 'PASSWORD_RESET', envs.FORGOT_PASSWORD_EMAIL_EXPIRATION_MINUTES)
        //Frontend goes to -> POST backend/api/auth/validate-reset-password-token
        const resetPasswordUrl = `${envs.FRONTEND_BASE_URL}/auth/reset-password/${plainToken}`
        await this.emailSender.sendEmail({
            from: envs.EMAIL_ADDRESS,
            to: user.email,
            subject: 'Reset password',
            html: HtmlTemplateAdapter.getHtmlTemplate('forgot-password.template.html',
                {
                    resetUrl: resetPasswordUrl,
                    forgot_password_email_expiration_minutes: `${envs.FORGOT_PASSWORD_EMAIL_EXPIRATION_MINUTES}`,
                    copyright_date: new Date().getFullYear().toString()
                })
        })
    }

    validateResetPasswordToken = async (token: string) => {
        await this.findUserTokenOrThrow(token, 'PASSWORD_RESET');
    }

    resetPassword = async (token: string, password: string) => {
        const tokenData = await this.findUserTokenOrThrow(token, 'PASSWORD_RESET');
        const hashedPassword = await this.passwordEncrypter.hashPassword(password, CONSTANTS.SALT_ROUNDS);
        await this.userRepository.resetPasswordTransaction(tokenData.userId, hashedPassword, new Date());
    }

    resendVerificationEmail = async (email: string) => {
        const user = await this.userRepository.findUserByEmail(email, { isActive: true, isEmailValidated: false })
        if (!user) return;
        await this.sendVerificationEmail(user)
    }

    private findUserTokenOrThrow = async (token: string, type: TokenType): Promise<UserTokenRecord> => {
        const hashedToken = this.tokenGenerator.hashToken(token);
        const tokenData = await this.userTokenRepository.findToken(hashedToken, type);
        if (!tokenData) throw CustomError.BadRequest('Invalid token');
        return tokenData;
    }

    private createUserToken = async (userId: string, type: TokenType, expirationMinutes: number): Promise<string> => {
        await this.userTokenRepository.deleteTokenByUserId(userId, type);
        const { plainToken, hashedToken } = this.generatePlainAndHashedTokens();
        const expirationDate = DateAdapter.addMinutes(expirationMinutes);
        await this.userTokenRepository.createToken(userId, hashedToken, type, expirationDate);
        return plainToken;
    }

    private sendVerificationEmail = async (user: UserRecord) => {
        const plainToken = await this.createUserToken(user.id, 'EMAIL_VERIFICATION', envs.EMAIL_TOKEN_EXPIRATION_MINUTES)
        //Frontend base url, frontend goes to -> POST backend/api/auth/validate-email
        const verificationEmailUrl = `${envs.FRONTEND_BASE_URL}/auth/validate-email/${plainToken}`
        await this.emailSender.sendEmail({
            from: envs.EMAIL_ADDRESS,
            to: user.email,
            subject: 'Validate your email',
            html: HtmlTemplateAdapter.getHtmlTemplate('verification-email.template.html',
                {
                    serviceUrl: verificationEmailUrl,
                    email_token_expiration_minutes: `${envs.EMAIL_TOKEN_EXPIRATION_MINUTES}`,
                    copyright_date: new Date().getFullYear().toString()
                })
        });
    }

    private generatePlainAndHashedTokens = (): { plainToken: string, hashedToken: string } => {
        const token = this.tokenGenerator.generateToken();
        const hashedToken = this.tokenGenerator.hashToken(token);
        return {
            plainToken: token,
            hashedToken
        }
    }
}