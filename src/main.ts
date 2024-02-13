import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApplication } from '@classting/app.initializer';
import { ConfigService } from '@nestjs/config';
import { AppEnvironment } from '@classting/configs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeApplication(app);

  const configService = app.get(ConfigService<AppEnvironment>);
  const port = configService.get('APP_PORT');

  initializeOpenApi(app);
  await app.listen(port);
}
bootstrap();

function initializeOpenApi<T extends INestApplication>(app: T): void {
  const options = new DocumentBuilder()
    .setTitle('classting mission')
    .setDescription('클래스팅 미션 api documentation')
    .setVersion('1.0.0')
    .addCookieAuth('connect.sid')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);
}
