export interface Encrypter {
    hashPassword(password: string, saltRounds: number): Promise<string>
    comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>
}