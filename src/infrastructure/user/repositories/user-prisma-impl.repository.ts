import { prisma } from "../../../data/prisma";
import { CreateUserDto } from "../../../domain/user/dto/create-user.dto";
import { UserRecord } from "../../../domain/user/models/user.record";
import { UserRepository } from "../../../domain/user/respositories/user.repository";

export class UserRepositoryPrismaImpl implements UserRepository {

    getUserById = async (id: string): Promise<UserRecord | null> => {
        return await prisma.user.findFirst({
            where: {
                id
            }
        })
    }

    findByEmail = async (email: string): Promise<UserRecord | null> => {
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
}