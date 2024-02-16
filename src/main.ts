import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppEnvironment, initializeApplication } from '@libs/configs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeApplication(app);
  initializeOpenApi(app);

  const configService = app.get(ConfigService<AppEnvironment>);
  const port = configService.get('APP_PORT');
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
