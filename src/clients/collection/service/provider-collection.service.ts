import { CreateProviderCollectionDto } from '@collection-client/entities/create-provider-collection.dto';
import { ProviderCollection } from '@collection-client/entities/model/provider-collection.model';
import { ObjectId } from '@mongoose/type';
import { GraphqlConnection } from '@pagination/connection.factory';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { CreateVocabInput } from '@vocabulary-client/entities/input/create-vocab.input';
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
    vocabulariesKeyByCollectionName: Map<string, CreateVocabInput[]>,
  ): Promise<void>;
}
