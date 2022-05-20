import { ObjectId } from '@mongoose/type';
import { AddVocabularyToCollectionInput } from '@collection-client/entities/input/add-vocabulary-to-collection.input';
import { CreateCollectionInput } from '@collection-client/entities/input/create-collection.input';
import { GraphqlConnection } from '@pagination/connection.factory';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { LeanDocument } from 'mongoose';
import { UserCollection } from '../entities/model/user-collection.model';

export const SelfLearningCollectionServiceToken =
  'SelfLearningCollectionServiceToken';

export interface SelfLearningCollectionService {
  findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<UserCollection>>>;
  createOne(input: CreateCollectionInput): Promise<UserCollection & ObjectId>;
  addVocabularyToCollection(
    input: AddVocabularyToCollectionInput,
  ): Promise<void>;
  assignCollectionToUser(
    collection: UserCollection,
    userId: string,
  ): Promise<void>;
}
