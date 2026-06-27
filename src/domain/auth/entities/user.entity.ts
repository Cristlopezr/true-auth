export class UserEntity {
    private constructor(public readonly id: string, public readonly name: string,
        public readonly email: string,
        public readonly roles: string[]) { }

    static fromRecord = (props: { [key: string]: any }) => {
        const { id, name, email, roles } = props;
        return new UserEntity(id, name, email, roles);
    }
}