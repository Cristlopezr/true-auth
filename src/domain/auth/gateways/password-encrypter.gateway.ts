export interface PasswordEncrypter {
    hashPassword(password: string, saltRounds: number): Promise<string>
    comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>
}