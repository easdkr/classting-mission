import { AppEnvironment } from '@classting/configs';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisClient extends Redis implements OnApplicationShutdown {
  public constructor(private readonly configService: ConfigService<AppEnvironment>) {
    super({
      host: configService.getOrThrow('REDIS_HOST'),
      port: configService.getOrThrow('REDIS_PORT'),
    });
  }

  onApplicationShutdown() {
    return this.disconnect();
  }
}
