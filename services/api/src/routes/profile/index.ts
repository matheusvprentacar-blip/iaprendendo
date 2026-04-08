import type { FastifyPluginAsync } from 'fastify';

export const profileRoutes: FastifyPluginAsync = async (server) => {
  server.post<{ Params: { student_id: string } }>('/:student_id', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 2 });
  });

  server.patch<{ Params: { student_id: string } }>('/:student_id', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 2 });
  });
};
