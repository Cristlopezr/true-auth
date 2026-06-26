export class UserEntity {
    private constructor(private readonly id: string, private readonly name: string, private readonly email: string) { }

    static fromJson = (props: { [key: string]: any }) => {
        const { id, name, email } = props;
        return new UserEntity(id, name, email);
    }
}