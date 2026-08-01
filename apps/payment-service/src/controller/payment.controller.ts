import { Context } from 'hono';
import { razorpay } from '../lib/razorpay';
import { sendKafkaEvent } from '@repo/kafka';

export const createRazorpayOrderHandler = async (c: Context) => {
  try {
    const { amount, orderId } = await c.req.json();
    if (!amount || !orderId) {
      return c.json({ error: 'Missing required parameters: amount or orderId' }, 400);
    }
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `order_rcpt_${orderId}`,
    });
    return c.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('[Payment Controller Error]:', err);
    return c.json({ error: err.message || 'Failed to create payment order' }, 500);
  }
};

export const handleRazorpayWebhookHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log('[Razorpay Webhook Event Received]:', body.event);
    if (body.event === 'payment.captured') {
      const paymentIntent = body.payload.payment.entity;

      const orderId =
        paymentIntent.notes?.orderId || paymentIntent.receipt?.replace('order_rcpt_', '');
      console.log('Payment Success for Order ID:', paymentIntent.order_id);

      await sendKafkaEvent('payment-events', 'ORDER_PAYMENT_SUCCESS', {
        orderId,
        razorpayPyamentId: paymentIntent.id,
        razorpayOrderId: paymentIntent.order_id,
        amount: paymentIntent.amount / 100,
        email: paymentIntent.email,
      });
    }

    return c.json({ status: 'ok' }, 200);
  } catch (err: any) {
    console.error('[Webhook Error]:', err);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
};
