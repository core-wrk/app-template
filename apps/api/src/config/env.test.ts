import { describe, expect, it } from 'vitest';
import { developmentAuthSecret, loadEnv } from './env';

describe('loadEnv', () => {
  it('uses the development secret outside production', () => {
    expect(loadEnv({ NODE_ENV: 'test' }).BETTER_AUTH_SECRET).toBe(developmentAuthSecret);
  });

  it('rejects a missing production auth secret', () => {
    expect(() => loadEnv({ NODE_ENV: 'production' })).toThrow(
      'A unique BETTER_AUTH_SECRET is required in production.',
    );
  });

  it('rejects the development secret in production', () => {
    expect(() =>
      loadEnv({ NODE_ENV: 'production', BETTER_AUTH_SECRET: developmentAuthSecret }),
    ).toThrow('A unique BETTER_AUTH_SECRET is required in production.');
  });

  it('accepts a unique production auth secret', () => {
    const secret = 'a-unique-production-secret-that-is-long-enough';
    expect(loadEnv({ NODE_ENV: 'production', BETTER_AUTH_SECRET: secret }).BETTER_AUTH_SECRET).toBe(
      secret,
    );
  });
});
