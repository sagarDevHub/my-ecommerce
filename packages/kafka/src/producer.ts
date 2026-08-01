import { Producer } from 'kafkajs';
import { kafka } from './client';

let producer: Producer | null = null;

export const getKafkaProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log(`✅ Kafka Producer connected`);
  }
  return producer;
};

export const sendKafkaEvent = async <T>(topic: string, event: string, data: T) => {
  try {
    const p = await getKafkaProducer();
    await p.send({
      topic,
      messages: [
        {
          key: event,
          value: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
        },
      ],
    });
    console.log(`📤 [Kafka] Published '${event}' to topic '${topic}'`);
  } catch (error) {
    console.error(`❌ [Kafka] Failed to publish event '${event}' to '${topic}':`, error);
    throw error;
  }
};
