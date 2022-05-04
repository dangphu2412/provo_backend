import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import {
  extractOrigins,
  logApplicationInformation,
} from './utils/app-bootstrap.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;
  const origins = extractOrigins(configService.get('CORS_ORIGINS'));

  app.enableCors({
    origin: origins,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress());

  await app.listen(port);

  logApplicationInformation(app);
}
bootstrap();
