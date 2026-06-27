export interface JwtOptions {
    expiresIn?: number
}

export interface JWT {
    signJWT(payload: string | object, secret: string, options?: JwtOptions): string
    verifyJWT<T>(token: string, secret: string): T
}