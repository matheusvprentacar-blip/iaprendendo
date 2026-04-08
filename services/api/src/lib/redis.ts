import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableReadyCheck: true,
});

redis.on('error', (error: Error) => {
  console.error('[Redis] connection error:', error.message);
});

redis.on('connect', () => {
  console.error('[Redis] connected');
});
