import { envs } from "./config/envs.js";
import { Server } from "./presentation/server.js"


(() => {
    const server = new Server(envs.PORT);
    server.start()
})()