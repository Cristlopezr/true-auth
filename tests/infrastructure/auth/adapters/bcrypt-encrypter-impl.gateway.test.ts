import bcrypt from 'bcrypt'
import { BcryptEncrypterImpl } from "../../../../src/infrastructure/auth/adapters/bcrypt-encrypter-impl.gateway"


describe('bcrypt-encrypter-impl.gateway', () => {


    let encrypter: BcryptEncrypterImpl;

    beforeEach(() => {
        encrypter = new BcryptEncrypterImpl();
    })

    it('hashPassword should call bcrypt.hash with correct arguments', async () => {

        const saltRounds = 10;
        const password = 'mypassword';
        const hashedPasswordResult = 'hashed_pasword'
        const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPasswordResult as never)

        const hashedPassword = await encrypter.hashPassword(password, saltRounds);

        expect(bcryptHashSpy).toHaveBeenCalledWith(password, saltRounds)

        expect(hashedPassword).toBe(hashedPasswordResult)
    })

    it.each([true, false])('comparePassword should call bcrypt.compare with correct arguments and return %s', async (mockedReturn) => {

        const plainTextPassword = 'mypassword'
        const hashedPassword = 'hashedpassword'
        const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(mockedReturn as never);

        const result = await encrypter.comparePassword(plainTextPassword, hashedPassword);
        
        expect(bcryptCompareSpy).toHaveBeenCalledWith(plainTextPassword, hashedPassword)
        expect(result).toBe(mockedReturn)
    })
})