import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { SearchModule } from '@search/search.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, SearchModule],
  controllers: [HealthController],
})
export class HealthModule {}
