import { UserEntity } from "../domain/user/entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
            /* refreshToken?: string; */
        }
    }
}

export { };