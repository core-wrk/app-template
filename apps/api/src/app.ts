import { cors } from 'hono/cors';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { apiError } from '@core-wrk/shared';
import type { AppDatabase } from '@core-wrk/db';
import type { Auth } from './auth/auth';
import type { AppEnv } from './config/env';
import { requireAuth, type SessionContext } from './middleware/auth';
import { createAuthRoute } from './routes/auth';
import { healthRoute } from './routes/health';
import { createProjectsRoute } from './routes/projects';
import {
  createProjectService,
  ProjectNotFoundError,
  type ProjectService,
} from './services/project-service';

type AppVariables = { Variables: { requestId: string; session: SessionContext } };

export interface AppDependencies {
  auth: Auth;
  db?: AppDatabase;
  projects?: ProjectService;
  env?: Pick<AppEnv, 'NODE_ENV' | 'WEB_ORIGIN'>;
}

export function createApp(dependencies: AppDependencies): Hono<AppVariables> {
  const app = new Hono<AppVariables>();
  const env = dependencies.env ?? { NODE_ENV: 'development', WEB_ORIGIN: 'http://localhost:5173' };
  const projects =
    dependencies.projects ?? (dependencies.db ? createProjectService(dependencies.db) : undefined);

  app.use('*', secureHeaders());
  app.use('*', async (c, next) => {
    const requestId = c.req.header('x-request-id') ?? crypto.randomUUID();
    c.set('requestId', requestId);
    c.header('x-request-id', requestId);
    await next();
  });
  app.use('/api/*', cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use('*', logger());

  app.route('/api/auth', createAuthRoute(dependencies.auth));
  app.route('/api', healthRoute);

  if (projects) {
    const authMiddleware = requireAuth(dependencies.auth);
    app.use('/api/projects', authMiddleware);
    app.use('/api/projects/*', authMiddleware);
    app.route('/api', createProjectsRoute(projects));
  }

  app.notFound((c) => c.json(apiError('NOT_FOUND', 'Route not found'), 404));
  app.onError((error, c) => {
    if (error instanceof ProjectNotFoundError) {
      return c.json(apiError('NOT_FOUND', error.message), 404);
    }
    console.error(JSON.stringify({ requestId: c.get('requestId'), error: error.message }));
    return c.json(
      apiError(
        'INTERNAL_ERROR',
        env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      ),
      500,
    );
  });

  return app;
}
