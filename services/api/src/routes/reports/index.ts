import type { FastifyPluginAsync } from 'fastify';

export const reportsRoutes: FastifyPluginAsync = async (server) => {
  server.get<{ Params: { id: string } }>('/student/:id', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 5 });
  });
};
