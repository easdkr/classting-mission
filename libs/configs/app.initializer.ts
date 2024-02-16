import * as passport from 'passport';
import * as session from 'express-session';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppEnvironment } from '@libs/configs';
import RedisStore from 'connect-redis';
import { RedisClient } from '@libs/redis';

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
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const configService = app.get(ConfigService<AppEnvironment>);
  const isProduction = configService.get('NODE_ENV') === 'production';
  const isTest = configService.get('NODE_ENV') === 'test';

  const sessionName = '_sid_';
  const sessionStore = isTest ? new session.MemoryStore() : new RedisStore({ client: app.get(RedisClient) });
  const sessionSecret = configService.getOrThrow<string>('SESSION_SECRET');
  const cookieMaxAge = 7 * 24 * 60 * 60 * 1000; // 7d;

  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
      name: sessionName,
      store: sessionStore,
      proxy: true,
      cookie: {
        httpOnly: true,
        secure: isProduction,
        maxAge: cookieMaxAge, // 7d
      },
    } as session.SessionOptions),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
