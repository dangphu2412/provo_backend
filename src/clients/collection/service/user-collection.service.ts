import { CreateCollectionDto } from '@collection-client/dto/create-collection.dto';
import { GraphqlConnection } from '@pagination/connection.factory';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { LeanDocument } from 'mongoose';
import { UserCollection } from './../model/user-collection.model';

export const UserCollectionServiceToken = 'UserCollectionServiceToken';

export interface UserCollectionService {
  findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<UserCollection>>>;

  createOne(dto: CreateCollectionDto): Promise<void>;
}
