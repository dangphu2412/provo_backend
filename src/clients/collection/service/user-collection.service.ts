import { ObjectId } from '@mongoose/type';
import { AddVocabularyToCollectionInput } from '@collection-client/dto/add-vocabulary-to-collection.input';
import { CreateCollectionInput } from '@collection-client/dto/create-collection.input';
import { GraphqlConnection } from '@pagination/connection.factory';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { LeanDocument } from 'mongoose';
import { UserCollection } from './../model/user-collection.model';

export const UserCollectionServiceToken = 'UserCollectionServiceToken';

export interface UserCollectionService {
  findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<UserCollection>>>;
  createOne(dto: CreateCollectionInput): Promise<UserCollection & ObjectId>;
  addVocabularyToCollection(
    input: AddVocabularyToCollectionInput,
  ): Promise<void>;
  assignCollectionToUser(
    collection: UserCollection,
    userId: string,
  ): Promise<void>;
}
