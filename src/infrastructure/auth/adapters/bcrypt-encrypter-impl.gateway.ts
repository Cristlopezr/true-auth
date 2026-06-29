import { PasswordEncrypter } from "../../../domain/auth/gateways/password-encrypter.gateway";
import bcrypt from 'bcrypt'

export class BcryptEncrypterImpl implements PasswordEncrypter {

    hashPassword = async (password: string, saltRounds: number) => {
        return await bcrypt.hash(password, saltRounds);
    }

    comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}