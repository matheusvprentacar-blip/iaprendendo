import { describe, expect, it } from 'vitest';
import Fastify from 'fastify';
import { buildApp } from './app.js';

describe('buildApp', () => {
  it('registers health route', async () => {
    const server = Fastify();
    await buildApp(server);

    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
    });

    await server.close();
  });
});
