import { CONSTANTS } from "../../config/constants";
import { envs } from "../../config/envs";
import { CreateUserDto } from "../../domain/auth/dto/create-user.dto";
import { Encrypter } from "../../domain/auth/gateways/encrypter.gateway";
import { JWT } from "../../domain/auth/gateways/jwt.gateway";
import { AuthRepository } from "../../domain/auth/repositories/auth.repository"
import { CustomError } from "../../domain/common/custom-error";

export class AuthService {

    constructor(private readonly authRepository: AuthRepository,
        private readonly encrypter: Encrypter,
        private readonly jwt: JWT) { }

    login = async (email: string, password: string) => {
        const user = await this.authRepository.findByEmail(email);

        if (!user) throw CustomError.Unauthorized('Invalid credentials');

        const passwordMatch = this.encrypter.comparePassword(password, user.password);

        if (!passwordMatch) throw CustomError.Unauthorized('Invalid credentials');

        const token = this.jwt.signJWT({ sub: user.id }, envs.JWT_SECRET);


        return { user, token };
    }

    register = async (createUserDto: CreateUserDto) => {
        const hashedPassword = await this.encrypter.hashPassword(createUserDto.password, CONSTANTS.SALT_ROUNDS)
        const user = await this.authRepository.createUser({ ...createUserDto, password: hashedPassword });
        const token = this.jwt.signJWT({ sub: user.id }, envs.JWT_SECRET)

        return {
            user,
            token
        }
    }

    refreshToken = () => {
        return this.authRepository.refreshToken();
    }

}