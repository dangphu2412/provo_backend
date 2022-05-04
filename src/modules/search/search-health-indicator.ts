import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

/**
 * @deprecated Currently not used.
 */
@Injectable()
export class ElasticHealthIndicator extends HealthIndicator {
  constructor(private readonly client: ElasticsearchService) {
    super();
  }

  async pingCheck(): Promise<HealthIndicatorResult> {
    const result = await this.client.cluster.health();
    return {
      elastic: {
        status: result.body.status,
        details: result.body,
      },
    };
  }
}
