import { UserCollectionService } from '@collection-client/service/user-collection.service';
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
import {
  UserCollection,
  UserCollectionDocument,
} from './../../clients/collection/model/user-collection.model';

export class UserCollectionServiceImpl implements UserCollectionService {
  constructor(
    @InjectModel(UserCollection.name)
    private readonly userCollectionModel: Model<UserCollectionDocument>,
    @Inject(CursorConnectionExecutorToken)
    private readonly cursorConnectionExecutor: CursorConnectionExecutor,
  ) {}

  public async findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<UserCollection>>> {
    const query = this.userCollectionModel.find<UserCollection>().lean();

    const request = new CursorConnectionRequestBuilder({
      query,
      paginationArguments: args,
    });

    return this.cursorConnectionExecutor.buildConnection(request);
  }
}
