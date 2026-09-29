import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });
config();

export default defineConfig({
  schema: './packages/db/src/schema/index.ts',
  out: './packages/db/src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL_DIRECT ??
      process.env.DATABASE_URL ??
      'postgres://starter:starter@localhost:5432/core_wrk_starter',
  },
  verbose: true,
  strict: true,
});
