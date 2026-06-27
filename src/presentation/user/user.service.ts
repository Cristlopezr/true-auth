import { UserEntity } from "../../domain/auth/entities/user.entity";
import { CustomError } from "../../domain/common/custom-error";
import { UserRepository } from "../../domain/user/respositories/user.repository";

export class UserService {

    constructor(private readonly userRepository: UserRepository) {
    }

    getUserById = async (id: string): Promise<UserEntity> => {
        const user = await this.userRepository.getUserById(id);
        if (!user) throw CustomError.NotFound(`User with id ${id} not found`)
        return UserEntity.fromJson(user)
    }

}