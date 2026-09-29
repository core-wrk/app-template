import type { MiddlewareHandler } from 'hono';
import { apiError } from '@core-wrk/shared';
import type { Auth } from '../auth/auth';

export interface SessionContext {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    id: string;
  };
}

type AuthVariables = { Variables: { session: SessionContext } };

export function requireAuth(auth: Auth): MiddlewareHandler<AuthVariables> {
  return async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json(apiError('UNAUTHORIZED', 'Authentication is required'), 401);
    }

    c.set('session', session as SessionContext);
    await next();
  };
}
