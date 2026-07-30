import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export const publishEvent = async (destinationUrl: string, data: Record<string, any>) => {
  try {
    const res = await qstash.publishJSON({
      url: destinationUrl,
      body: data,
    });
    console.log('[QStash] Event Published:', res);
  } catch (err) {
    console.error('[QStash] Failed to publish event:', err);
  }
};
