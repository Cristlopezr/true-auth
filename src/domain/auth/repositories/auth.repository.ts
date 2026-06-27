import { CreateUserDto } from "../dto/create-user.dto"
import { UserRecord } from "../models/user.record"

export interface AuthRepository {
    findByEmail(email: string): Promise<UserRecord | null>
    createUser(createUserDto: CreateUserDto): Promise<UserRecord>
    refreshToken(): Promise<string>
}