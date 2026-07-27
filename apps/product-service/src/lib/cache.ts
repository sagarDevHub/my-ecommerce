import { redis } from './redis';

export const invalidateProductListCache = async () => {
  try {
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Failed to invalidate product list cache:', error);
  }
};

export const invalidateProductCache = async (id: number) => {
  try {
    await redis.del(`product:${id}`);
    await invalidateProductListCache();
  } catch (error) {
    console.error(`Failed to invalidate cache for product ${id}:`, error);
  }
};
