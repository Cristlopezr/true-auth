import { UserEntity } from "../domain/auth/entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
        }
    }
}

export { };