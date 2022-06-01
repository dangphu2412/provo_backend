import { CreateProviderCollectionDto } from '@collection-client/entities/create-provider-collection.dto';
import { ProviderCollection } from '@collection-client/entities/model/provider-collection.model';
import { GraphqlConnection } from '@pagination/connection.factory';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { LeanDocument } from 'mongoose';

export const ProviderCollectionServiceToken = 'ProviderCollectionService';

export interface ProviderCollectionService {
  findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<ProviderCollection>>>;
  findById(id: string): Promise<LeanDocument<ProviderCollection> | null>;

  createMany(collectionDtos: CreateProviderCollectionDto[]): Promise<void>;
}
