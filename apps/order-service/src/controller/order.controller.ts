import { FastifyReply, FastifyRequest } from 'fastify';
import { redis } from '../lib/redis';
import { prisma } from '@repo/order-db';

const CACHE_TTL = 300;

export const getUserOrdersHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  const userId = req.userId;
  const cacheKey = `order:user:${userId}`;

  try {
    const cachedOrders = await redis.get(cacheKey);
    if (cachedOrders) {
      return rep.send({
        source: 'cache',
        data: cachedOrders,
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });
    await redis.set(cacheKey, orders, { ex: CACHE_TTL });

    return rep.send({
      source: 'database',
      data: orders,
    });
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: 'Failed to retrieve orders' });
  }
};

export const getAllOrdersHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const orders = await prisma.order.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    return rep.send(orders);
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: 'Failed to fetch all orders' });
  }
};
