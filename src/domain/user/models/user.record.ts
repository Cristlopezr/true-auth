export type UserRecord = {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: string[];
    isEmailValidated: boolean;
    isActive: boolean;
}