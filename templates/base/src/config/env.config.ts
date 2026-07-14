import { getEnv, getOptionalEnv } from "../utils/get-env.js";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "3000"),
  BASE_URL: getEnv("BASE_URL", "http://localhost:3000"),
  DB_URL: getOptionalEnv("DB_URL"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
};
