import { envs } from "../src/config/envs";
import { AppRoutes } from "../src/presentation/app-routes";
import { Server } from "../src/presentation/server";

export const testServer = new Server(envs.PORT, AppRoutes.routes);