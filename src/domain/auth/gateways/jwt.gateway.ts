export interface JwtOptions {
    expiresIn?: number
}

export interface JwtPayload {
    sub: string
}

export interface JWT {
    signJWT(payload: string | object, options?: JwtOptions): string
    verifyJWT(token: string): JwtPayload
}