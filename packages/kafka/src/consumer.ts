import { Consumer } from 'kafkajs';
import { kafka } from './client';

export interface KafkaMessagePayload<T = any> {
  event: string;
  data: T;
  timestamp: string;
}

export const createKafkaConsumer = async (
  groupId: string,
  topics: string[],
  eachMessage: (payload: {
    topic: string;
    partition: number;
    message: KafkaMessagePayload;
  }) => Promise<void>
): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  console.log(`✅ Kafka Consumer connected [GroupId: ${groupId}]`);

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;
      try {
        const parsed: KafkaMessagePayload = JSON.parse(message.value.toString());
        await eachMessage({ topic, partition, message: parsed });
      } catch (err) {
        console.error(`❌ [Kafka] Error processing message on topic ${topic}:`, err);
      }
    },
  });
  return consumer;
};
