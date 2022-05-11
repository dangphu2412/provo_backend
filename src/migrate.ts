import { FireStoreMigration } from '@mongoose/firestore-migration';
import { MigrationModule } from '@mongoose/migration.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(MigrationModule);
  const migration = app.get(FireStoreMigration);
  await migration.migrate();
  process.exit(0);
}

bootstrap();
