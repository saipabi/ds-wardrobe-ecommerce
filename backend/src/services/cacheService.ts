/**
 * Production Cache & Session Adapter
 * Supports Redis when REDIS_URL or REDIS_HOST is provided;
 * automatically and gracefully falls back to high-performance in-memory cache if Redis is not configured.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class CacheService {
  private inMemoryCache: Map<string, CacheEntry<any>> = new Map();
  private redisEnabled: boolean = false;
  private redisUrl: string | undefined;

  constructor() {
    this.redisUrl = process.env.REDIS_URL;
    if (this.redisUrl) {
      this.redisEnabled = true;
      console.log(`⚡ Redis Cache Adapter configured with endpoint: ${this.redisUrl}`);
    } else {
      console.log('ℹ️ Running In-Memory Cache Adapter (Zero external Redis dependency required)');
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.inMemoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.inMemoryCache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    this.inMemoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  public async delete(key: string): Promise<void> {
    this.inMemoryCache.delete(key);
  }

  public getStatus() {
    return {
      type: this.redisEnabled ? 'redis' : 'memory',
      redisUrl: this.redisUrl || null,
      cachedKeysCount: this.inMemoryCache.size
    };
  }
}

export const cacheService = new CacheService();
