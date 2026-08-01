import { prisma } from '@repo/order-db';
import { redis } from '../../lib/redis';

export interface PaymentSuccessPayload {
  orderId: string;
  userId: string;
  razorpayPaymentId: string;
  amount: number;
}

export const handlePaymentSuccess = async (data: PaymentSuccessPayload) => {
  const { orderId, userId } = data;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'success' },
  });
  await redis.del(`user:${userId}:orders`);
  console.log(`✅ [Order Service] Order ${orderId} marked as 'paid' & Upstash cache invalidated`);
};
