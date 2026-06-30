import { CONSTANTS } from "../../config/constants";
import { CreateUserDto } from "../../domain/user/dto/create-user.dto";
import { PasswordEncrypter } from "../../domain/auth/gateways/password-encrypter.gateway";
import { JWT } from "../../domain/auth/gateways/jwt.gateway";
import { CustomError } from "../../domain/common/custom-error";
import { UserRepository } from "../../domain/user/respositories/user.repository";
import { LoginUserDto } from "../../domain/auth/dto/login-user.dto";
import { UserEntity } from "../../domain/user/entities/user.entity";
import { EmailVerificationRepository } from "../../domain/auth/repositories/email-verification.repository";
import { TokenGenerator } from "../../domain/auth/gateways/token-generator.gateway";
import { UserRecord } from "../../domain/user/models/user.record";
import { EmailSender } from "../../domain/common/gateways/email-sender";
import { envs } from "../../config/envs";
import { SessionRepository } from "../../domain/auth/repositories/session.repository";
import { DateAdapter } from "../../infrastructure/common/date-adapter";

export class AuthService {

    constructor(private readonly userRepository: UserRepository,
        private readonly passwordEncrypter: PasswordEncrypter,
        private readonly jwt: JWT,
        private readonly emailVerificationRepository: EmailVerificationRepository,
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
        const hashedToken = this.tokenGenerator.hashToken(token);
        const tokenData = await this.emailVerificationRepository.findToken(hashedToken);
        if (!tokenData) throw CustomError.BadRequest('Invalid or expired verification token.');

        await this.userRepository.validateEmailTransaction(tokenData.userId);
        return {
            message: 'Email successfully validated'
        }
    }

    refreshJwtToken = async (refreshToken: string) => {
        const hashedRefreshToken = this.tokenGenerator.hashToken(refreshToken)
        //Revoke Session to rotate refreshToken
        const revokedSession = await this.sessionRepository.revokeSession(hashedRefreshToken, new Date());
        if (!revokedSession) throw CustomError.Unauthorized('Invalid session');
        const { user, expiresAt } = revokedSession;

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

    sendVerificationEmail = async (user: UserRecord) => {
        await this.emailVerificationRepository.deleteTokenByUserId(user.id);

        const { plainToken, hashedToken } = this.generatePlainAndHashedTokens();

        const expirationDate = DateAdapter.addMinutes(envs.EMAIL_TOKEN_EXPIRATION_MINUTES);
        await this.emailVerificationRepository.createToken(user.id, hashedToken, expirationDate);

        const serviceUrl = `${envs.EMAIL_VERIFICATION_SERVICE_URL}/${plainToken}`
        await this.emailSender.sendEmail({
            from: envs.EMAIL_ADDRESS,
            to: user.email,
            subject: 'Validate your email',
            html: this.getEmailHtml(serviceUrl)
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

    private getEmailHtml = (serviceUrl: string) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
        </head>
        <body style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #18181b;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Verify Your Email</h1>
                </div>
                <div style="padding: 40px;">
                    <p style="font-size: 16px; line-height: 1.6; color: #3f3f46; margin-bottom: 24px;">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #3f3f46; margin-bottom: 24px;">Thank you for registering! To complete your signup and secure your account, please verify your email address by clicking the verification button below.</p>
                    
                    <div style="text-align: center; margin-bottom: 32px;">
                        <!-- Update the href with your actual frontend URL if needed -->
                        <a href="${serviceUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">Verify Email Now</a>
                    </div>
                    
                    <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 24px; text-align: center;">This verification link will expire in ${envs.EMAIL_TOKEN_EXPIRATION_MINUTES} minutes.</p>

                    <p style="font-size: 16px; line-height: 1.6; color: #3f3f46; margin-bottom: 24px;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="font-size: 14px; color: #64748b; margin: 0;">&copy; ${new Date().getFullYear()} TrueAuth. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}