import { LeanDocument } from 'mongoose';
import { ProviderCollection } from '@collection-client/model/provider-collection.model';
import { GraphqlConnection } from '@pagination/connection.factory';
import { PaginationArgs } from '@pagination/dto/pagination-args';

export const ProviderCollectionServiceToken = 'ProviderCollectionService';

export interface ProviderCollectionService {
  findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<ProviderCollection>>>;
}
