import { envs } from "./config/envs.js";
import { AppRoutes } from "./presentation/app-routes.js";
import { Server } from "./presentation/server.js"


(() => {
    const server = new Server(envs.PORT, AppRoutes.routes);
    server.start()
})()