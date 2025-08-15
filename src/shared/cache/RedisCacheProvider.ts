import Redis from "ioredis";

export class RedisCacheProvider {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds) await this.client.set(key, stringValue, "EX", ttlSeconds);
    else await this.client.set(key, stringValue);
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}
