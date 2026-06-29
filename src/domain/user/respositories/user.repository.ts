import { CreateUserDto } from "../dto/create-user.dto";
import { UserRecord } from "../models/user.record";

export interface FindUserOptions {
    isEmailValidated?: boolean;
    isActive?: boolean;
}

export interface UserRepository {
    findUserById(id: string, options?: FindUserOptions): Promise<UserRecord | null>
    findUserByEmail(email: string, options?: FindUserOptions): Promise<UserRecord | null>
    createUser(createUserDto: CreateUserDto): Promise<UserRecord>
    validateEmailTransaction(userId: string): Promise<void>
}