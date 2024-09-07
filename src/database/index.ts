import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres'

import { ENV_CONFIGS } from '../config/envConfig';

const pool = new Pool(ENV_CONFIGS.postgresConfig);

const db = drizzle(pool);

export default db;
