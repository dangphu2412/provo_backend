import {
  ProviderCollection,
  ProviderCollectionDocument,
} from '@collection-client/model/provider-collection.model';
import { ProviderCollectionService } from '@collection-client/service/provider-collection.service';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphqlConnection } from '@pagination/connection.factory';
import {
  CursorConnectionExecutor,
  CursorConnectionExecutorToken,
} from '@pagination/cursor-connection-excutor';
import { CursorConnectionRequestBuilder } from '@pagination/cursor-connection-request';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { LeanDocument, Model } from 'mongoose';

export class ProviderCollectionServiceImpl
  implements ProviderCollectionService
{
  constructor(
    @InjectModel(ProviderCollection.name)
    private readonly providerCollectionModel: Model<ProviderCollectionDocument>,
    @Inject(CursorConnectionExecutorToken)
    private readonly cursorConnectionExecutor: CursorConnectionExecutor,
  ) {}

  async findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<ProviderCollection>>> {
    const query = this.providerCollectionModel
      .find<ProviderCollection>()
      .lean();

    const request = new CursorConnectionRequestBuilder({
      query,
      paginationArguments: args,
    });

    return this.cursorConnectionExecutor.buildConnection(request);
  }
}
