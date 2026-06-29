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
    EMAIL_TOKEN_EXPIRATION_MINUTES: get("EMAIL_TOKEN_EXPIRATION_MINUTES").default(10).asInt(),
    EMAIL_ADDRESS: get("EMAIL_ADDRESS").required().asString(),
    GMAIL_APP_PASSWORD: get("GMAIL_APP_PASSWORD").required().asString(),
    EMAIL_VERIFICATION_SERVICE_URL: get("EMAIL_VERIFICATION_SERVICE_URL").required().asString(),
    REFRESH_TOKEN_EXPIRATION_DAYS: get("REFRESH_TOKEN_EXPIRATION_DAYS").required().asInt(),
    COOKIE_DOMAIN: get("COOKIE_DOMAIN").asString(),
    NODE_ENV: get("NODE_ENV").required().asEnum(['development', 'production', 'test'])
};
