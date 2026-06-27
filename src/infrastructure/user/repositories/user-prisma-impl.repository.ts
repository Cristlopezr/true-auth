import { prisma } from "../../../data/prisma";
import { UserEntity } from "../../../domain/auth/entities/user.entity";
import { CustomError } from "../../../domain/common/custom-error";
import { UserRepository } from "../../../domain/user/respositories/user.repository";

export class UserPrismaRepositoryImpl implements UserRepository {

    getUserById = async (id: string): Promise<UserEntity | null> => {
        return await prisma.user.findFirst({
            where: {
                id
            }
        })
    }

}