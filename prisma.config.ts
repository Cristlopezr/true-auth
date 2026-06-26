import { envs } from "./src/config/envs"; import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma", migrations:
    { path: "prisma/migrations", }, datasource: { url: envs.DATABASE_URL, },
});