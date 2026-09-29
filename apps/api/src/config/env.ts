import { z } from 'zod';

export const developmentAuthSecret = 'development-only-secret-change-me-please-32-chars';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().min(32).optional(),
    PORT: z.coerce.number().int().min(1).max(65535).default(8787),
    WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
    API_URL: z.string().url().optional(),
  })
  .superRefine((values, ctx) => {
    if (
      values.NODE_ENV === 'production' &&
      (!values.BETTER_AUTH_SECRET || values.BETTER_AUTH_SECRET === developmentAuthSecret)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['BETTER_AUTH_SECRET'],
        message: 'A unique BETTER_AUTH_SECRET is required in production.',
      });
    }
  })
  .transform((values) => ({
    ...values,
    BETTER_AUTH_SECRET: values.BETTER_AUTH_SECRET ?? developmentAuthSecret,
  }));

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(values: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(values);
}
