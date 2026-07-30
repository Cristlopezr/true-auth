import { plainToInstance } from "class-transformer";
import { RegisterUserDtoImpl } from "../../../../src/presentation/auth/dto/register-user-impl.dto";
import { validate } from "class-validator";

describe('register-user-impl.dto', () => {

    const createDto = (data: Partial<RegisterUserDtoImpl>) => {
        return plainToInstance(RegisterUserDtoImpl, {
            name: 'Valid Name',
            email: 'valid@email.com',
            password: 'Password123',
            ...data
        });
    };

    it('Should pass with completely valid data', async () => {
        const dto = createDto({});

        const errors = await validate(dto);
        expect(errors.length).toBe(0)
    })

    it.each([{
        intent: "Should fail when name is empty",
        payload: {
            name: "",
        },
        field: "name",
        expectedError: "minLength",
    }, {
        intent: "Should fail when name is too long (51 characters)",
        payload: {
            name: "a".repeat(51),
        },
        field: "name",
        expectedError: "maxLength",
    }, {
        intent: "Should fail when email is invalid",
        payload: {
            email: "test",
        },
        field: "email",
        expectedError: "isEmail",
    }, {
        intent: "Should fail when password is too short (less than 6 characters)",
        payload: {
            password: "123"
        },
        field: "password",
        expectedError: "minLength",
    }, {
        intent: "Should fail when password is too long (51 characters)",
        payload: {
            password: "a".repeat(51),
        },
        field: "password",
        expectedError: "maxLength",
    }, {
        intent: "Should fail when password lacks uppercase letter",
        payload: {
            password: "password123"
        },
        field: "password",
        expectedError: "matches",
    }, {
        intent: "Should fail when password lacks lowercase letter",
        payload: {
            password: "PASSWORD123"
        },
        field: "password",
        expectedError: "matches",
    }, {
        intent: "Should fail when password lacks number or special character",
        payload: {
            password: "Password"
        },
        field: "password",
        expectedError: "matches",
    }])('$intent', async ({ payload, field, expectedError }) => {
        const dto = createDto(payload);
        const errors = await validate(dto);

        const targetError = errors.find(err => err.property === field);
        expect(targetError).toBeDefined();
        expect(targetError?.constraints).toHaveProperty(expectedError);
    })
})