import { Hono } from 'hono';
import type { Auth } from '../auth/auth';

export function createAuthRoute(auth: Auth) {
  return new Hono().on(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], '/*', (c) =>
    auth.handler(c.req.raw),
  );
}
