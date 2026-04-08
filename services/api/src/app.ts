import type { FastifyInstance } from 'fastify';
import { adaptationRoutes } from './routes/adaptation/index.js';
import { consentRoutes } from './routes/consent/index.js';
import { curriculumRoutes } from './routes/curriculum/index.js';
import { missionsRoutes } from './routes/missions/index.js';
import { profileRoutes } from './routes/profile/index.js';
import { reportsRoutes } from './routes/reports/index.js';
import { telemetryRoutes } from './routes/telemetry/index.js';

export async function buildApp(server: FastifyInstance): Promise<void> {
  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  await server.register(curriculumRoutes, { prefix: '/api/curriculum' });
  await server.register(adaptationRoutes, { prefix: '/api/adaptation' });
  await server.register(telemetryRoutes, { prefix: '/api/telemetry' });
  await server.register(reportsRoutes, { prefix: '/api/reports' });
  await server.register(consentRoutes, { prefix: '/api/consent' });
  await server.register(missionsRoutes, { prefix: '/api/missions' });
  await server.register(profileRoutes, { prefix: '/api/profile' });
}
