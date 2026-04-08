import type { FastifyPluginAsync } from 'fastify';

export const telemetryRoutes: FastifyPluginAsync = async (server) => {
  server.post('/events', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
