import { prisma } from "../../../data/prisma";
import { CreateUserDto } from "../../../domain/auth/dto/create-user.dto";
import { UserEntity } from "../../../domain/auth/entities/user.entity";
import { UserRecord } from "../../../domain/auth/models/user.record";
import { AuthRepository } from "../../../domain/auth/repositories/auth.repository";

export class AuthPrismaRepositoryImplementation implements AuthRepository {
    async findByEmail(email: string): Promise<UserRecord | null> {
        return await prisma.user.findFirst({
            where: {
                email
            }
        })
    }
    createUser = async (createUserDto: CreateUserDto): Promise<UserRecord> => {
        return await prisma.user.create({
            data: createUserDto
        })
    }
    async refreshToken(): Promise<string> {
        return `refreshToken in respository`
    }
}