import { prisma } from "../../../data/prisma";
import { CreateUserDto } from "../../../domain/auth/dto/create-user.dto";
import { UserEntity } from "../../../domain/auth/entities/user.entity";
import { AuthRepository } from "../../../domain/auth/repositories/auth.repository";

export class AuthMongoRepositoryImplementation implements AuthRepository {
    async login(): Promise<UserEntity> {
        throw new Error("Method not implemented")
    }

    register = async (createUserDto: CreateUserDto): Promise<UserEntity> => {
        const user = await prisma.user.create({
            data: createUserDto
        })

        return UserEntity.fromJson(user);
    }
    async refreshToken(): Promise<string> {
        return `refreshToken in respository`
    }
}