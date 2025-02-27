import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';

import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';
import { ms, StringValue } from './libs/utils/ms';
import { parseBoolean } from './libs/utils/parseBoolen';
import IORedis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow<string>('REDIS_URI'));
  const allowedOrigins = config
    .getOrThrow<string>('ALLOWED_ORIGIN')
    ?.split(',');


  app.use(cookieParser(config.getOrThrow('COOKIE_SECRET')));


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    // exposedHeaders: ['set-cookie'],
  });

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
      }),
    }),
  );

  await app.listen(config.getOrThrow('APPLICATION_PORT'));
}
bootstrap();
