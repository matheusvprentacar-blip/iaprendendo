import type { FastifyPluginAsync } from 'fastify';

export const adaptationRoutes: FastifyPluginAsync = async (server) => {
  server.post('/generate', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
