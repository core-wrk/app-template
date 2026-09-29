import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { AppDatabase } from '@core-wrk/db';
import { branding } from '@core-wrk/shared';

export function createAuth({
  db,
  trustedOrigins,
  baseURL,
  secret,
}: {
  db: AppDatabase;
  trustedOrigins: string[];
  baseURL?: string;
  secret: string;
}) {
  return betterAuth({
    appName: branding.applicationName,
    baseURL,
    basePath: '/api/auth',
    secret,
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    trustedOrigins,
    advanced: {
      useSecureCookies: process.env.NODE_ENV === 'production',
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
