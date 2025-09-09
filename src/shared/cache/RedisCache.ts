import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

class RedisCache {
  private client: RedisClient;
  private connected = false;

  constructor() {
    if (!this.connected) {
      this.client = new Redis(cacheConfig.config.redis);
      this.connected = true;
    }
  }

  /**
   * Salva um valor no Redis
   * @param key - chave de cache
   * @param value - valor a ser armazenado
   * @param ttl - tempo de expiração em segundos (opcional)
   */
  public async save(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  /**
   * Recupera um valor do Redis
   * @param key - chave de cache
   */
  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parseData = JSON.parse(data) as T;
    return parseData;
  }

  /**
   * Invalida (remove) uma chave de cache
   * @param key - chave de cache
   */
  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Invalida todas as chaves que começam com o prefixo informado
   */
  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();

    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }
}

export default new RedisCache();
