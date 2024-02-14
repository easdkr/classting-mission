import * as passport from 'passport';
import * as session from 'express-session';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppEnvironment } from '@classting/configs';
import RedisStore from 'connect-redis';
import { RedisClient } from '@classting/redis';

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
  const isProduction = configService.get('NODE_ENV') === 'production';

  const redisClient = app.get(RedisClient);

  const sessionSecret = configService.getOrThrow<string>('SESSION_SECRET');

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
      name: '_sid_',
      store: new RedisStore({
        client: redisClient,
      }),
      proxy: true,
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
