import { createKafkaConsumer } from '@repo/kafka';
import { handlePaymentSuccess, PaymentSuccessPayload } from './handlers/paymentHandler';

export const initOrderKafkaListners = async () => {
  await createKafkaConsumer(
    'order-service-group',
    ['payment-events'],
    async ({ topic, message }) => {
      console.log(`📥 [Order Service] Processing event '${message.event}' from topic '${topic}'`);

      switch (message.event) {
        case 'ORDER_PAYMENT_SUCCESS':
          await handlePaymentSuccess(message.data as PaymentSuccessPayload);
          break;
        default:
          console.warn(`⚠️ [Order Service] Unhandled Kafka event type: ${message.event}`);
          break;
      }
    }
  );
};
