import Fastify from 'fastify';
import { buildApp } from './app.js';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty' }
        : undefined,
  },
});

async function start(): Promise<void> {
  try {
    await buildApp(server);
    const port = Number(process.env.PORT ?? 3000);
    await server.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
