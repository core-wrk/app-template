import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/index';

export function createDb(
  databaseUrl = process.env.DATABASE_URL,
): ReturnType<typeof drizzle<typeof schema>> {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to connect to PostgreSQL');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema });
}

export type AppDatabase = ReturnType<typeof createDb>;
export { schema };
