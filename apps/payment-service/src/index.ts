import { cors } from 'hono/cors';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { shouldBeUser } from './middleware/authMiddleware.js';
import paymentRoutes from './routes/payment.route.js';

const app = new Hono();
app.use('*', clerkMiddleware());

app.use(
  '*',
  cors({
    origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-dev-user-id'],
    credentials: true,
  })
);

app.get('/health', c => {
  return c.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get('/test', shouldBeUser, c => {
  return c.json({
    message: `Payment service is authenticated`,
    userId: c.get('userId'),
  });
});

app.route('/', paymentRoutes);

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      info => {
        console.log(`Payment service is running on (PORT: 8002)`);
      }
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
