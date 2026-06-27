import { Encrypter } from "../../../domain/auth/gateways/encrypter.gateway";
import bcrypt from 'bcrypt'

export class BcryptEncrypterImpl implements Encrypter {

    hashPassword = async (password: string, saltRounds: number) => {
        return await bcrypt.hash(password, saltRounds);
    }

    comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}