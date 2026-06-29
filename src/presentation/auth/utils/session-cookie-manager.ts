import { CookieOptions, NextFunction, Request, Response } from "express";
import { envs } from "../../../config/envs";
import { DateAdapter } from "../../../infrastructure/common/date-adapter";
import { CustomError } from "../../../domain/common/custom-error";

export class SessionCookieManager {

    private static readonly COOKIE_NAME = 'sessionId';

    private static get cookieOptions(): CookieOptions {
        return {

            domain: envs.COOKIE_DOMAIN || undefined,
            path: '/api',
            secure: envs.NODE_ENV === 'production' ? true : false,
            httpOnly: true,
            sameSite: envs.NODE_ENV === 'production' ? "strict" : "lax"
        }
    }

    static set(res: Response, refreshToken: string) {
        res.cookie(SessionCookieManager.COOKIE_NAME, refreshToken,
            {
                ...SessionCookieManager.cookieOptions,
                expires: DateAdapter.addDays(envs.REFRESH_TOKEN_EXPIRATION_DAYS)
            }
        )
    }

    static clear(res: Response) {
        res.clearCookie(SessionCookieManager.COOKIE_NAME, SessionCookieManager.cookieOptions)
    }

    static get(req: Request): string {
        const cookie = req.cookies?.[SessionCookieManager.COOKIE_NAME];
        if (!cookie) throw CustomError.Unauthorized('Refresh token missing in cookies');
        return cookie;
    }
}