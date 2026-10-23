import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler/dist/throttler-storage.interface';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import Redis from 'ioredis';

/**
 * Redis-backed storage adapter for `@nestjs/throttler`.
 *
 * Stores hit counts in Redis with TTL-based expiry, enabling rate-limiting
 * that works across multiple API Gateway instances.
 */
@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    _throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const hitCount = await this.redis.incr(key);
    const keyTtl = await this.redis.ttl(key);
    if (keyTtl < 0) {
      await this.redis.expire(key, ttl);
    }

    const isBlocked = hitCount > limit;
    const blockKey = `${key}:blocked`;
    if (isBlocked) {
      await this.redis.set(blockKey, '1', 'EX', blockDuration || ttl);
    }

    const blockedTtl = Math.max(await this.redis.ttl(blockKey), 0);

    return {
      totalHits: hitCount,
      timeToExpire: Math.max(await this.redis.ttl(key), 0),
      isBlocked,
      timeToBlockExpire: blockedTtl,
    };
  }
}
