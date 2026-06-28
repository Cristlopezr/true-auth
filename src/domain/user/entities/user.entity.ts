import { UserRecord } from "../models/user.record";

export class UserEntity {
    private constructor(public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly roles: string[],
        public readonly isEmailValidated: boolean,
        public readonly isActive: boolean
    ) { }

    static fromRecord = (props: UserRecord) => {
        const { id, name, email, roles, isEmailValidated, isActive } = props;
        return new UserEntity(id, name, email, roles, isEmailValidated, isActive);
    }
}