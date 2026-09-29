import { Hono } from 'hono';

export const healthRoute = new Hono().get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
  });
});
