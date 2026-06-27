import { CreateUserDto } from "../dto/create-user.dto"
import { UserEntity } from "../entities/user.entity"

export interface AuthRepository {
    login(): Promise<UserEntity>
    register(createUserDto: CreateUserDto): Promise<UserEntity>
    refreshToken(): Promise<string>
}