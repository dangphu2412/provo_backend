import { FireStoreMigration } from './firestore-migration';
import { Controller, Post } from '@nestjs/common';

@Controller('database')
export class DatabaseController {
  constructor(private readonly migration: FireStoreMigration) {}

  @Post()
  public async migrate() {
    await this.migration.migrate();
  }
}
