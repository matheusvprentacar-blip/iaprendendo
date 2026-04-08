import type { FastifyPluginAsync } from 'fastify';

export const curriculumRoutes: FastifyPluginAsync = async (server) => {
  server.get<{ Params: { bncc_code: string } }>('/:bncc_code', async (_request, reply) => {
    return reply.status(501).send({ error: 'Not implemented', bloco: 3 });
  });
};
