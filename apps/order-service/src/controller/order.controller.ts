import { FastifyReply, FastifyRequest } from 'fastify';
import { redis } from '../lib/redis';
import { prisma } from '@repo/order-db';

const CACHE_TTL = 300;
const ADDRESSES_CACHE_TTL = 3600;

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

export const createOrderHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userId = (req as any).userId;
    const { email, amount, products } = req.body as {
      email: string;
      amount: string;
      products: any;
    };
    const newOrder = await prisma.order.create({
      data: {
        userId,
        email,
        amount,
        status: 'pending',
        products,
      },
    });

    await redis.del(`user:${userId}:orders`);
    return rep.status(201).send(newOrder);
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ message: 'Failed to create order' });
  }
};

export const createAddressHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userId = (req as any).userId;
    const { name, email, phone, address, city, isDefault } = req.body as {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      isDefault?: boolean;
    };

    const newAddress = await prisma.userAddress.create({
      data: {
        userId,
        name,
        email,
        phone,
        address,
        city,
        isDefault: isDefault || false,
      },
    });

    return rep.status(201).send(newAddress);
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ message: 'Failed to save address' });
  }
};

export const getAddressHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return rep.status(401).send({ message: 'Unauthorised' });
    }
    const cacheKey = `user:${userId}:addresses`;

    const cachedAdresses = await redis.get<any[]>(cacheKey);

    if (cachedAdresses) {
      req.log.info({ userId }, 'Serving addresses from Redis cache');
      return rep.status(200).send(cachedAdresses);
    }
    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rep.status(200).send(addresses);
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ message: 'Failed to fetch addresses' });
  }
};

export const getSingleOrderHandler = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };

    if (!userId) {
      return rep.status(401).send({ message: 'Unauthorized' });
    }

    const order = await prisma.order.findFirst({
      where: { id, userId },
    });

    if (!order) {
      return rep.status(404).send({ message: 'Order not found' });
    }
    return rep.status(200).send(order);
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ message: 'Failed to fetch order details' });
  }
};
