export interface JwtOptions {
    expiresIn?: number
}

export interface JwtPayload {
    sub: string
}

export interface JWT {
    signJWT(payload: string | object, secret: string, options?: JwtOptions): string
    verifyJWT(token: string, secret: string): JwtPayload
}