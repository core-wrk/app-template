import { config } from 'dotenv';
import path from 'node:path';
import { serve } from '@hono/node-server';
import { createDb } from '@core-wrk/db';
import { loadEnv } from './config/env';
import { createAuth } from './auth/auth';
import { createApp } from './app';

config({
  path: [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '../../.env.local'),
  ],
});
config();

const env = loadEnv();
const db = createDb(env.DATABASE_URL);
const auth = createAuth({
  db,
  trustedOrigins: [env.WEB_ORIGIN],
  baseURL: env.API_URL,
  secret: env.BETTER_AUTH_SECRET,
});
const app = createApp({ db, auth, env });

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
