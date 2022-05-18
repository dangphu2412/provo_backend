import { AddVocabularyToCollectionInput } from '@collection-client/dto/add-vocabulary-to-collection.input';
import { CreateCollectionInput } from '@collection-client/dto/create-collection.input';
import { UserCollectionService } from '@collection-client/service/user-collection.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphqlConnection } from '@pagination/connection.factory';
import {
  CursorConnectionExecutor,
  CursorConnectionExecutorToken,
} from '@pagination/cursor-connection-excutor';
import { CursorConnectionRequestBuilder } from '@pagination/cursor-connection-request';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { instanceToPlain } from 'class-transformer';
import { LeanDocument, Model } from 'mongoose';
import { UserCollection } from '@collection-client/model/user-collection.model';
import { UserService, UserServiceToken } from '@user-client/user.service';

export class UserCollectionServiceImpl implements UserCollectionService {
  constructor(
    @InjectModel(UserCollection.name)
    private readonly userCollectionModel: Model<UserCollection>,
    @Inject(CursorConnectionExecutorToken)
    private readonly cursorConnectionExecutor: CursorConnectionExecutor,
    @Inject(UserServiceToken)
    private readonly userService: UserService,
  ) {}

  async createOne(dto: CreateCollectionInput) {
    const newCollection = await this.userCollectionModel.create(dto);
    return newCollection.save();
  }

  async addVocabularyToCollection(
    input: AddVocabularyToCollectionInput,
  ): Promise<void> {
    const { id, createVocabDto } = input;
    const collection = await this.userCollectionModel
      .findById(id)
      .lean()
      .exec();

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    collection.vocabularies.push(instanceToPlain(createVocabDto) as any);

    await this.userCollectionModel.updateOne(
      { _id: id },
      { $set: { vocabularies: collection.vocabularies } },
    );
  }

  public async assignCollectionToUser(
    collection: UserCollection,
    userId: string,
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.ownedCollections.push(collection._id);
    await this.userService.updateOne(user);
  }

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
