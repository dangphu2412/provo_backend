import { ObjectId } from '@mongoose/type';
import { CreateProviderCollectionDto } from '@collection-client/dto/create-provider-collection.dto';
import { ProviderCollection } from '@collection-client/model/provider-collection.model';
import { GraphqlConnection } from '@pagination/connection.factory';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import { LeanDocument } from 'mongoose';

export const ProviderCollectionServiceToken = 'ProviderCollectionService';

export interface ProviderCollectionService {
  findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<ProviderCollection>>>;
  findManyAndCreateIfMissing(
    names: string[],
  ): Promise<(LeanDocument<ProviderCollection> & ObjectId)[]>;

  createMany(dtos: CreateProviderCollectionDto[]): Promise<void>;
  createMany(
    vocabulariesKeyByCollectionName: Map<string, CreateVocabDto[]>,
  ): Promise<void>;
}
