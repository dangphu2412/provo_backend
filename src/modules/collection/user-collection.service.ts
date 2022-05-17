import { AddVocabularyToCollectionInput } from '@collection-client/dto/add-vocabulary-to-collection.input';
import { CreateCollectionDto } from '@collection-client/dto/create-collection.dto';
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
import {
  UserCollection,
  UserCollectionDocument,
} from '@collection-client/model/user-collection.model';

export class UserCollectionServiceImpl implements UserCollectionService {
  constructor(
    @InjectModel(UserCollection.name)
    private readonly userCollectionModel: Model<UserCollectionDocument>,
    @Inject(CursorConnectionExecutorToken)
    private readonly cursorConnectionExecutor: CursorConnectionExecutor,
  ) {}

  async createOne(dto: CreateCollectionDto): Promise<void> {
    (await this.userCollectionModel.create(dto)).save();
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
    console.log(createVocabDto);

    collection.vocabularies.push(instanceToPlain(createVocabDto) as any);

    await this.userCollectionModel.updateOne(
      { _id: id },
      { $set: { vocabularies: collection.vocabularies } },
    );
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
