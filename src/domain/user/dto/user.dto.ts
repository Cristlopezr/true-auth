import { UserEntity } from "../entities/user.entity";

export class UserDto {

    private constructor(public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly roles: string[],
        public readonly isEmailValidated: boolean,
        public readonly isActive: boolean
    ) { }

    static fromEntity = (user: UserEntity): UserDto => {
        const { id, name, email, roles, isEmailValidated, isActive } = user;
        return new UserDto(id, name, email, roles, isEmailValidated, isActive)
    }
}