import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvLoaderUtils } from './env-loader.util';

export function extractOrigins(rawConfigString: string) {
  const ALLOW_ALL_ORIGINS = '*';
  if (!rawConfigString) {
    return ALLOW_ALL_ORIGINS;
  }
  return EnvLoaderUtils.loadMany(rawConfigString);
}

export function logScaffoldApp(app: INestApplication) {
  const logger: Logger = new Logger('AppBootstrap');
  const configService: ConfigService = app.get(ConfigService);

  logger.log(`Application is running on port ${configService.get('PORT')}`);
  logger.log(`Application is running in ${configService.get('NODE_ENV')} mode`);
  logger.log(
    `Graphql is running on route ${
      configService.get('GRAPHQL_ROUTE') || '/graphql'
    }`,
  );
  logger.log(
    'Memory usage: ' +
      Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) +
      'MB' +
      ' CPU usage: ' +
      process.cpuUsage().user / 1000 +
      '%',
  );
}
