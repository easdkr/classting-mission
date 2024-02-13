import * as passport from 'passport';
import * as session from 'express-session';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppEnvironment } from '@classting/configs';
import { Redis } from 'ioredis';
import RedisStore from 'connect-redis';

export function initializeApplication<T extends INestApplication>(app: T): void {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableShutdownHooks();
  app.enableVersioning({ type: VersioningType.URI });

  const configService = app.get(ConfigService<AppEnvironment>);
  const isProduction = !!configService.getOrThrow<string>('NODE_ENV');
  const redisHost = configService.getOrThrow<string>('REDIS_HOST');
  const redisPort = configService.getOrThrow<number>('REDIS_PORT');
  const redisClient = new Redis({
    host: redisHost,
    port: redisPort,
  });

  const sessionSecret = configService.getOrThrow<string>('SESSION_SECRET');

  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
      store: new RedisStore({
        client: redisClient,
      }),
      cookie: {
        httpOnly: true,
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      },
    } as session.SessionOptions),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
