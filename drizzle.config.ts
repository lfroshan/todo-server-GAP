import { Config } from 'drizzle-kit';
import { ENV_CONFIGS } from './src/config/envConfig';

console.log(ENV_CONFIGS);

export default {
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/database/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: `postgres://${ENV_CONFIGS.postgresConfig.user}:${ENV_CONFIGS.postgresConfig.password}@${ENV_CONFIGS.postgresConfig.host}:${ENV_CONFIGS.postgresConfig.port}/${ENV_CONFIGS.postgresConfig.database}`
  },
  verbose: true,
  strict: true,
} as Config;
