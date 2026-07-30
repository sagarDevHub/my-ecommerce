import { FastifyInstance } from 'fastify';
import { shouldBeAdmin, shouldBeUser } from '../middleware/authMiddleware';
import {
  createAddressHandler,
  createOrderHandler,
  getAddressHandler,
  getAllOrdersHandler,
  getSingleOrderHandler,
  getUserOrdersHandler,
} from '../controller/order.controller';

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get('/user-orders', { preHandler: shouldBeUser }, getUserOrdersHandler);
  fastify.post('/user-orders', { preHandler: shouldBeUser }, createOrderHandler);
  fastify.get('/orders', { preHandler: shouldBeAdmin }, getAllOrdersHandler);
  fastify.get('/addresses', { preHandler: shouldBeUser }, getAddressHandler);
  fastify.post('/addresses', { preHandler: shouldBeUser }, createAddressHandler);
  fastify.get('/user-orders/:id', { preHandler: shouldBeUser }, getSingleOrderHandler);
};
