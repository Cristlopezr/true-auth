import { Router } from "express"
import { AuthRoutes } from "./auth/auth.routes";
import { UserRoutes } from "./user/user.routes";

export class AppRoutes {
    static get routes() {
        const router = Router();
        router.use('/auth', AuthRoutes.routes)
        router.use('/user', UserRoutes.routes)
        return router
    }
}