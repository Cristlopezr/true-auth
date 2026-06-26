import { CreateUserDto } from "../../domain/dto/create-user.dto";
import { AuthRepository } from "../../domain/repositories/auth.repository"

export class AuthService {

    constructor(private readonly authRepository: AuthRepository) { }

    login = () => {
        return this.authRepository.login()
    }

    register = async (createUserDto: CreateUserDto) => {
        return await this.authRepository.register(createUserDto);
    }

    refreshToken = () => {
        return this.authRepository.refreshToken();
    }

}