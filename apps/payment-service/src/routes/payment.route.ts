import { Hono } from 'hono';
import {
  createRazorpayOrderHandler,
  handleRazorpayWebhookHandler,
} from '../controller/payment.controller';

const paymentRoutes = new Hono();

paymentRoutes.post('/create-order', createRazorpayOrderHandler);
paymentRoutes.post('/webhook', handleRazorpayWebhookHandler);

export default paymentRoutes;
