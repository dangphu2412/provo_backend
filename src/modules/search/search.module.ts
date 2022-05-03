import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { VocabularySearchServiceToken } from '@search-client/vocabulary-search.service';
import { ElasticHealthIndicator } from './search-health-indicator';
import { VocabularySearchServiceImpl } from './vocabulary-search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_HOST'),
      }),
    }),
  ],
  providers: [
    {
      provide: VocabularySearchServiceToken,
      useClass: VocabularySearchServiceImpl,
    },
    ElasticHealthIndicator,
  ],
  exports: [VocabularySearchServiceToken, ElasticHealthIndicator],
})
export class SearchModule {}
