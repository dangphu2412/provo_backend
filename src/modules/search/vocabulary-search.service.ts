import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchResult } from '@search-client/search-result';
import {
  VocabularySearchDocument,
  VocabularySearchService,
} from '@search-client/vocabulary-search.service';

/**
 * @deprecated Currently not used.
 */
@Injectable()
export class VocabularySearchServiceImpl implements VocabularySearchService {
  private readonly indexKey = 'vocabulary';

  constructor(private readonly searchService: ElasticsearchService) {}

  async index(documents: VocabularySearchDocument[]): Promise<void> {
    return Promise.resolve();
  }

  async search(text: string) {
    const result = await this.searchService.search<
      SearchResult<VocabularySearchDocument>
    >({
      index: this.indexKey,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['word'],
          },
        },
      },
      size: 10,
    });

    const hits = result.body.hits.hits;
    return hits.map((item) => item._source);
  }
}
