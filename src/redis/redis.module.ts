import { RedisClient } from '@classting/redis/redis-client';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [RedisClient],
  exports: [RedisClient],
})
export class RedisModule {}
