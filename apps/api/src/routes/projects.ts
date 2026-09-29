import { Hono } from 'hono';
import {
  apiError,
  createProjectSchema,
  projectIdSchema,
  projectListQuerySchema,
  updateProjectSchema,
} from '@core-wrk/shared';
import type { SessionContext } from '../middleware/auth';
import type { ProjectService } from '../services/project-service';

type ProjectsEnv = { Variables: { session: SessionContext } };

function sessionUserId(session: SessionContext): string {
  return session.user.id;
}

export function createProjectsRoute(service: ProjectService): Hono<ProjectsEnv> {
  const route = new Hono<ProjectsEnv>();

  route.get('/projects', async (c) => {
    const query = projectListQuerySchema.safeParse(c.req.query());
    if (!query.success) {
      return c.json(
        apiError('VALIDATION_ERROR', 'Invalid pagination parameters', query.error.flatten()),
        400,
      );
    }

    const projects = await service.list(
      sessionUserId(c.get('session')),
      query.data.limit,
      query.data.offset,
    );
    return c.json({ items: projects, limit: query.data.limit, offset: query.data.offset });
  });

  route.post('/projects', async (c) => {
    const body = await c.req.json().catch(() => null);
    const input = createProjectSchema.safeParse(body);
    if (!input.success) {
      return c.json(
        apiError('VALIDATION_ERROR', 'Invalid project data', input.error.flatten()),
        400,
      );
    }

    const project = await service.create(sessionUserId(c.get('session')), input.data);
    return c.json(project, 201);
  });

  route.get('/projects/:id', async (c) => {
    const params = projectIdSchema.safeParse(c.req.param());
    if (!params.success) {
      return c.json(
        apiError('VALIDATION_ERROR', 'Invalid project ID', params.error.flatten()),
        400,
      );
    }
    return c.json(await service.get(sessionUserId(c.get('session')), params.data.id));
  });

  route.patch('/projects/:id', async (c) => {
    const params = projectIdSchema.safeParse(c.req.param());
    const body = await c.req.json().catch(() => null);
    const input = updateProjectSchema.safeParse(body);
    if (!params.success || !input.success) {
      return c.json(
        apiError('VALIDATION_ERROR', 'Invalid project data', {
          params: params.error?.flatten(),
          body: input.error?.flatten(),
        }),
        400,
      );
    }
    return c.json(
      await service.update(sessionUserId(c.get('session')), params.data.id, input.data),
    );
  });

  route.delete('/projects/:id', async (c) => {
    const params = projectIdSchema.safeParse(c.req.param());
    if (!params.success) {
      return c.json(
        apiError('VALIDATION_ERROR', 'Invalid project ID', params.error.flatten()),
        400,
      );
    }
    await service.remove(sessionUserId(c.get('session')), params.data.id);
    return c.body(null, 204);
  });

  return route;
}
