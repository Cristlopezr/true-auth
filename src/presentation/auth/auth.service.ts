import { CONSTANTS } from "../../config/constants";
import { envs } from "../../config/envs";
import { CreateUserDto } from "../../domain/auth/dto/create-user.dto";
import { Encrypter } from "../../domain/auth/gateways/encrypter.gateway";
import { JWT } from "../../domain/auth/gateways/jwt.gateway";
import { AuthRepository } from "../../domain/auth/repositories/auth.repository"

export class AuthService {

    constructor(private readonly authRepository: AuthRepository,
        private readonly encrypter: Encrypter,
        private readonly jwt: JWT) { }

    login = () => {
        return this.authRepository.login()
    }

    register = async (createUserDto: CreateUserDto) => {
        const hashedPassword = await this.encrypter.hashPassword(createUserDto.password, CONSTANTS.SALT_ROUNDS)
        const user = await this.authRepository.register({ ...createUserDto, password: hashedPassword });
        const token = this.jwt.signJWT({ sub: user.id }, envs.JWT_SECRET)
        return {
            ...user,
            token
        }
    }

    refreshToken = () => {
        return this.authRepository.refreshToken();
    }

}