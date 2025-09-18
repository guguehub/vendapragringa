// /src/shared/cache/RedisCache.ts
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
    const stringValue = JSON.stringify(value);

    if (ttl) {
      await this.client.set(key, stringValue, 'EX', ttl);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  /**
   * Recupera um valor do Redis
   * @param key - chave de cache
   */
  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`[RedisCache] Falha ao parsear chave ${key}:`, error);
      return null;
    }
  }

  /**
   * Invalida (remove) uma chave de cache
   * @param key - chave de cache
   */
  public async invalidate(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`[RedisCache] Falha ao invalidar chave ${key}:`, error);
    }
  }

  /**
   * Invalida todas as chaves que começam com o prefixo informado
   * @param prefix - prefixo das chaves
   */
  public async invalidatePrefix(prefix: string): Promise<void> {
    try {
      const keys = await this.client.keys(`${prefix}:*`);
      if (keys.length === 0) return;

      const pipeline = this.client.pipeline();
      keys.forEach(key => pipeline.del(key));
      await pipeline.exec();
    } catch (error) {
      console.error(`[RedisCache] Falha ao invalidar prefixo ${prefix}:`, error);
    }
  }
}

export default new RedisCache();
