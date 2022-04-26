import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { extractOrigins, logScaffoldApp } from './utils/app-bootstrap.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: extractOrigins(configService.get('CORS_ORIGINS')),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress());
  await app.listen(configService.get('PORT') ?? 3000);

  logScaffoldApp(app);
}
bootstrap();
