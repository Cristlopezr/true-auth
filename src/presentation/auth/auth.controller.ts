import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserDto } from "../../domain/user/dto/user.dto";
import { SessionCookieManager } from "./utils/session-cookie-manager";
import { DateAdapter } from "../../infrastructure/common/date-adapter";
import { envs } from "../../config/envs";

export class AuthController {

    constructor(private readonly authService: AuthService) { }

    login = async (req: Request, res: Response) => {
        const { accessToken, refreshToken, user } = await this.authService.login(req.body)

        SessionCookieManager.set(res, refreshToken, DateAdapter.addDays(envs.REFRESH_TOKEN_EXPIRATION_DAYS));

        res.status(200).json({
            user: UserDto.fromEntity(user),
            accessToken
        })
    }

    logout = async (req: Request, res: Response) => {
        await this.authService.logout(SessionCookieManager.getCookieOrThrow(req));
        SessionCookieManager.clear(res);
        res.status(200).json({ ok: true })
    }

    deleteAllSessions = async (req: Request, res: Response) => {
        SessionCookieManager.getCookieOrThrow(req);
        await this.authService.deleteAllSessions(req.user!.id)
        SessionCookieManager.clear(res);
        res.status(200).json({ ok: true })
    }

    register = async (req: Request, res: Response) => {
        const data = await this.authService.register(req.body)
        res.status(201).json({ user: UserDto.fromEntity(data.user), message: data.message })
    }

    refreshJwtToken = async (req: Request, res: Response) => {
        const { accessToken, refreshToken, user, expiresAt } = await this.authService.refreshJwtToken(SessionCookieManager.getCookieOrThrow(req));
        SessionCookieManager.set(res, refreshToken, expiresAt)
        res.status(200).json({
            accessToken: accessToken,
            user: UserDto.fromEntity(user)
        })
    }

    validateEmail = async (req: Request, res: Response) => {
        //We could use try catch and redirect to success or fail status to the frontend
        /* res.redirect(`${envs.FRONTEND_URL}/email-verified?status=success`); */
        await this.authService.validateEmail(req.body.token as string);
        res.status(200).json({ ok: true, message: "Email validated successfully" })
    }

    forgotPassword = async (req: Request, res: Response) => {
        //Validar body
        await this.authService.sendForgotPasswordEmail(req.body.email)
        res.status(200).json({ ok: true, message: "Email sent successfully" })
    }

    validateResetPasswordToken = async (req: Request, res: Response) => {
        await this.authService.validateResetPasswordToken(req.body.token)
        res.status(200).json({ ok: true, message: "Valid token" })
    }

    resetPassword = async (req: Request, res: Response) => {
        await this.authService.resetPassword(req.body.token, req.body.password)
        res.status(200).json({ ok: true, message: "Password reset successfully" })
    }
}