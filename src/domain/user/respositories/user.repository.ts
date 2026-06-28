import { CreateUserDto } from "../dto/create-user.dto";
import { UserRecord } from "../models/user.record";

export interface UserRepository {
    getUserById(id: string): Promise<UserRecord | null>
    findByEmail(email: string): Promise<UserRecord | null>
    createUser(createUserDto: CreateUserDto): Promise<UserRecord>
}