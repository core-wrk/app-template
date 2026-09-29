import { describe, expect, it } from 'vitest';
import { createApp } from './app';
import type { Auth } from './auth/auth';
import type { ProjectService } from './services/project-service';

const user = { id: 'user-1', name: 'Test User', email: 'test@example.com' };

function fakeAuth(session: null | { user: typeof user } = null): Auth {
  return {
    api: { getSession: async () => (session ? { user, session: { id: 'session-1' } } : null) },
    handler: async () =>
      new Response(JSON.stringify({ ok: true }), {
        headers: { 'content-type': 'application/json' },
      }),
  } as unknown as Auth;
}

function fakeProjects(): ProjectService {
  return {
    list: async () => [],
    create: async (_ownerId, input) => ({
      id: '550e8400-e29b-41d4-a716-446655440000',
      ...input,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    get: async (_ownerId, id) => ({
      id,
      name: 'Test project',
      description: '',
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async (_ownerId, id, input) => ({
      id,
      name: input.name ?? 'Test project',
      description: input.description ?? '',
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    remove: async () => undefined,
  };
}

describe('API', () => {
  it('returns a health response without a database connection', async () => {
    const response = await createApp({ auth: fakeAuth() }).request('/api/health');
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: 'ok', service: 'api' });
  });

  it('rejects unauthenticated project requests', async () => {
    const app = createApp({ auth: fakeAuth(), projects: fakeProjects() });
    const response = await app.request('/api/projects');
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: { code: 'UNAUTHORIZED' } });
  });

  it('validates and serves authenticated project requests', async () => {
    const app = createApp({ auth: fakeAuth({ user }), projects: fakeProjects() });
    const invalid = await app.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
      headers: { 'content-type': 'application/json' },
    });
    expect(invalid.status).toBe(400);

    const response = await app.request('/api/projects');
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ items: [], limit: 50, offset: 0 });
  });

  it('mounts the authentication handler under the documented path', async () => {
    const response = await createApp({ auth: fakeAuth() }).request('/api/auth/get-session');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
