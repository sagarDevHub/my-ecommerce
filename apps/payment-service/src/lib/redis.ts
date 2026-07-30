import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const checkIdempotency = async (eventId: string): Promise<boolean> => {
  const isProcessed = await redis.get(`webhook:${eventId}`);
  return !!isProcessed;
};

export const markAsProcessed = async (eventId: string, ttlSeconds = 86400): Promise<void> => {
  await redis.set(`webhook:${eventId}`, 'true', { ex: ttlSeconds });
};
