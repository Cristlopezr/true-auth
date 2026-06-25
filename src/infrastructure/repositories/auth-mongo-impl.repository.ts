import { AuthRepository } from "../../domain/repositories/auth.repository";

export class AuthMongoRepositoryImplementation implements AuthRepository {
    async login(): Promise<string> {
        return `Login in repository`
    }
    async register(): Promise<string> {
        return `register in repository`
    }
    async refreshToken(): Promise<string> {
        return `refreshToken in respository`
    }
}