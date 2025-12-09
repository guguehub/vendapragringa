// src/shared/cache/RedisCache.ts
import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

class RedisCache {
  private client: RedisClient;
  private connected = false;

  constructor() {
    if (!this.connected) {
      this.client = new Redis(cacheConfig.config.redis);
      this.connected = true;
      console.log('⚡ [RedisCache] Conectado ao Redis com sucesso');
    }
  }

  /**
   * Salva um valor no Redis
   */
  public async save<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    try {
      if (ttl) {
        await this.client.set(key, stringValue, 'EX', ttl);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      console.error(`[RedisCache] Erro ao salvar chave ${key}:`, error);
    }
  }

  /**
   * Recupera um valor do Redis
   */
  public async recover<T = any>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`[RedisCache] Falha ao recuperar chave ${key}:`, error);
      return null;
    }
  }

  /**
   * Invalida uma chave específica
   */
  public async invalidate(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`[RedisCache] Falha ao invalidar chave ${key}:`, error);
    }
  }

  /**
   * Invalida todas as chaves que começam com um prefixo
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
