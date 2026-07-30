import cors from '@fastify/cors';
import { clerkPlugin } from '@clerk/fastify';
import Fastify from 'fastify';
import { shouldBeUser } from './middleware/authMiddleware.js';
import { orderRoute } from './routes/order.route.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-dev-user-id'],
  credentials: true,
});

const start = async () => {
  try {
    await fastify.register(clerkPlugin);

    fastify.get('/health', (request, reply) => {
      return reply.status(200).send({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now(),
      });
    });

    fastify.get('/test', { preHandler: shouldBeUser }, (request, reply) => {
      return reply.send({ message: `Order service is authenticated`, userId: request.userId });
    });

    await fastify.register(orderRoute);

    await fastify.listen({ port: 8001 });
    console.log(`Order service is running on (PORT: 8001)`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
