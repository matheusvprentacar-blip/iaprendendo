import type { FastifyPluginAsync } from 'fastify';

export const missionsRoutes: FastifyPluginAsync = async (server) => {
  server.get<{ Params: { student_id: string } }>('/:student_id', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
