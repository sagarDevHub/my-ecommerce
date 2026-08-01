import { Kafka, logLevel } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9094,localhost:9095,localhost:9096').split(
  ','
);

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-service',
  brokers,
  logLevel: logLevel.INFO,
});
