import Fastify from 'fastify';

const fastify = Fastify();

const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
    console.log(`Order service is running on (PORT: 8001)`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
