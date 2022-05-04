import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvLoaderUtils } from './env-loader.util';

export function extractOrigins(rawConfigString: string | undefined) {
  const ALLOW_ALL_ORIGINS = '*';
  if (!rawConfigString) {
    return ALLOW_ALL_ORIGINS;
  }
  return EnvLoaderUtils.loadMany(rawConfigString);
}

export function logApplicationInformation(app: INestApplication) {
  const logger: Logger = new Logger('AppBootstrap');
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;
  const origins = extractOrigins(configService.get('CORS_ORIGINS'));
  const env = configService.get('NODE_ENV');
  const graphRoute = configService.get('GRAPHQL_ROUTE') || '/graphql';
  const memUsage = Math.floor(process.memoryUsage().heapUsed / 1024 / 1024);

  logger.log(`Application is allowing origins: ${origins}`);
  logger.log(`Application is running on port ${port}`);
  logger.log(`Application is running in ${env} mode`);
  logger.log(`Graphql is running on route ${graphRoute}`);
  logger.log(
    `Memory usage: ${memUsage} MB -` +
      'CPU usage: ' +
      process.cpuUsage().user / 1000 +
      '%',
  );
}
