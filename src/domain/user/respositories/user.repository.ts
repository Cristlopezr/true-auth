import { UserEntity } from "../../auth/entities/user.entity";

export interface UserRepository {
    getUserById(id: string): Promise<UserEntity | null>
}