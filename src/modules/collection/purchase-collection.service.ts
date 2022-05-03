import {
  ProviderCollectionDocument,
  ProviderCollection,
} from '@collection-client/model/provider-collection.model';
import { ProviderCollectionService } from '@collection-client/service/provider-collection.service';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphqlConnection } from '@pagination/connection.factory';
import {
  CursorPaginationBuilderToken,
  CursorPaginationQueryBuilder,
} from '@pagination/cursor-pagination.builder';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { Model, LeanDocument } from 'mongoose';

export class ProviderCollectionServiceImpl
  implements ProviderCollectionService
{
  constructor(
    @InjectModel(ProviderCollection.name)
    private readonly providerCollectionModel: Model<ProviderCollectionDocument>,
    @Inject(CursorPaginationBuilderToken)
    private readonly cursorPaginationQueryBuilder: CursorPaginationQueryBuilder,
  ) {}

  async findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<ProviderCollection>>> {
    const query = this.providerCollectionModel
      .find<ProviderCollection>()
      .lean();

    const countQuery = query.clone().count();

    const [result, totalCount] = await Promise.all([
      this.cursorPaginationQueryBuilder.build(query, args),
      countQuery,
    ]);

    const edges = this.cursorPaginationQueryBuilder.buildEdges(result);

    return this.cursorPaginationQueryBuilder.buildConnection({
      edges,
      paginationArgs: args,
      totalCount,
    });
  }
}
