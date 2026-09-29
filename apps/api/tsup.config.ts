import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  bundle: true,
  noExternal: ['@core-wrk/db', '@core-wrk/shared'],
  external: ['pg', 'drizzle-orm', 'better-auth', '@hono/node-server', 'hono', 'dotenv', 'zod'],
  clean: true,
});
