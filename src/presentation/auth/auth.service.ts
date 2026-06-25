import { AuthRepository } from "../../domain/repositories/auth.repository"

export class AuthService {

    constructor(private readonly authRepository: AuthRepository) { }

    login = () => {
        return this.authRepository.login()
    }

    register = () => {
        return this.authRepository.register();
    }

    refreshToken = () => {
        return this.authRepository.refreshToken();
    }

}