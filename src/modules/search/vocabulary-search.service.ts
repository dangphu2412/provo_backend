import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { VocabularySearchService } from '@search-client/vocabulary-search.service';

@Injectable()
export class VocabularySearchServiceImpl implements VocabularySearchService {
  constructor(private readonly searchService: ElasticsearchService) {}

  async startIndex() {
    console.log('Logging');
  }
}
