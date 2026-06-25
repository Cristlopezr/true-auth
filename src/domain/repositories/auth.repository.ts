export interface AuthRepository {
    login(): Promise<string>
    register(): Promise<string>
    refreshToken(): Promise<string>
}