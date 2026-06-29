import "dotenv/config";
import envVar from "env-var";

const { get } = envVar;

export const envs = {
    PORT: get("PORT").required().asPortNumber(),
    POSTGRES_USER: get("POSTGRES_USER").required().asString(),
    POSTGRES_DB: get("POSTGRES_DB").required().asString(),
    POSTGRES_PASSWORD: get("POSTGRES_PASSWORD").required().asString(),
    DATABASE_URL: get("DATABASE_URL").required().asString(),
    JWT_SECRET: get("JWT_SECRET").required().asString(),
    EMAIL_TOKEN_EXPIRATION_MINUTES: get("EMAIL_TOKEN_EXPIRATION_MINUTES").default(10).asInt()
};
