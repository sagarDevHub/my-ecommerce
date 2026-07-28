import { FastifyInstance } from 'fastify';
import { shouldBeUser } from '../middleware/authMiddleware';
import { getAllOrdersHandler, getUserOrdersHandler } from '../controller/order.controller';

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get('/user-orders', { preHandler: shouldBeUser }, getUserOrdersHandler);
  fastify.get('/orders', getAllOrdersHandler);
};
