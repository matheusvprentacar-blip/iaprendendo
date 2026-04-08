import type { FastifyPluginAsync } from 'fastify';

export const consentRoutes: FastifyPluginAsync = async (server) => {
  server.post('/', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 2 });
  });
};
