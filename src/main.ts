import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { extractOrigins, logScaffoldApp } from './utils/app-bootstrap.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: extractOrigins(app.get(ConfigService).get('CORS_ORIGINS')),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(app.get(ConfigService).get('PORT') ?? 3000);

  logScaffoldApp(app);
}
bootstrap();
