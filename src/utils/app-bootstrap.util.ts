import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function extractOrigins(rawConfigString: string) {
  const ALLOW_ALL_ORIGINS = '*';
  if (!rawConfigString) {
    return ALLOW_ALL_ORIGINS;
  }
  return rawConfigString.trim().split(',');
}

export function logAppDetail(app: INestApplication) {
  const logger: Logger = new Logger('AppBootstrap');
  const configService: ConfigService = app.get(ConfigService);

  logger.log(`Application is running on port ${configService.get('PORT')}`);
  logger.log(`Application is running in ${configService.get('NODE_ENV')} mode`);
  logger.log(
    'Memory usage: ' +
      process.memoryUsage().heapUsed / 1024 / 1024 +
      'MB' +
      ' CPU usage: ' +
      process.cpuUsage().user / 1000 +
      '%',
  );
}
