import { CreateUserDto } from "../../domain/dto/create-user.dto";
import { Encrypter } from "../../domain/gateways/encrypter.gateway";
import { AuthRepository } from "../../domain/repositories/auth.repository"

export class AuthService {

    constructor(private readonly authRepository: AuthRepository,
        private readonly encrypter: Encrypter) { }

    login = () => {
        return this.authRepository.login()
    }

    register = async (createUserDto: CreateUserDto) => {
        const hashedPassword = await this.encrypter.hashPassword(createUserDto.password, 10)
        return await this.authRepository.register({ ...createUserDto, password: hashedPassword });
    }

    refreshToken = () => {
        return this.authRepository.refreshToken();
    }

}