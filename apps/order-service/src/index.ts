import { clerkPlugin } from '@clerk/fastify';
import Fastify from 'fastify';
import { shouldBeUser } from './middleware/authMiddleware.js';

const fastify = Fastify();

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
    await fastify.listen({ port: 8001 });
    console.log(`Order service is running on (PORT: 8001)`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
