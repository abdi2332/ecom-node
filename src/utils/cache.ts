import Redis from 'ioredis';

class CacheService {
  private redis: Redis;
  private defaultTTL = 300; // 5 minutes

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    this.redis.on('connect', () => {
      console.log(' Connected to Redis');
    });
    
    this.redis.on('error', (err) => {
      console.error(' connection error:', err);
    });
  }

  async get(key: string): Promise<any> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }



  generateProductsCacheKey(page: number, pageSize: number, search?: string, filters?: any): string {
    const filterString = filters ? JSON.stringify(filters) : '';
    return `products:${page}:${pageSize}:${search || 'all'}:${filterString}`;
  }
}

export const cache = new CacheService();