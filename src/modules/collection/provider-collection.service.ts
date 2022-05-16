import {
  VocabularyService,
  VocabularyServiceToken,
} from '@vocabulary-client/vocabulary.service';
import { CreateProviderCollectionDto } from '@collection-client/dto/create-provider-collection.dto';
import {
  ProviderCollection,
  ProviderCollectionDocument,
} from '@collection-client/model/provider-collection.model';
import { ProviderCollectionService } from '@collection-client/service/provider-collection.service';
import { LIMIT_PER_BULK_WRITE } from '@mongoose/constant';
import { ObjectId } from '@mongoose/type';
import { Inject, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphqlConnection } from '@pagination/connection.factory';
import {
  CursorConnectionExecutor,
  CursorConnectionExecutorToken,
} from '@pagination/cursor-connection-excutor';
import { CursorConnectionRequestBuilder } from '@pagination/cursor-connection-request';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import { isEmpty } from 'lodash';
import { LeanDocument, Model } from 'mongoose';
import { BulkWriteOperation } from '@mongoose/operation.type';

export class ProviderCollectionServiceImpl
  implements ProviderCollectionService
{
  private readonly logger: Logger;

  constructor(
    @InjectModel(ProviderCollection.name)
    private readonly providerCollectionModel: Model<ProviderCollectionDocument>,
    @Inject(CursorConnectionExecutorToken)
    private readonly cursorConnectionExecutor: CursorConnectionExecutor,
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {
    this.logger = new Logger(ProviderCollectionServiceImpl.name);
  }

  createMany(dtos: CreateProviderCollectionDto[]): Promise<void>;
  createMany(
    dtosOrVocabulariesKeyByCollectionName: Map<string, CreateVocabDto[]>,
  ): Promise<void>;
  async createMany(dtosOrVocabulariesKeyByCollectionName: any): Promise<void> {
    if (Array.isArray(dtosOrVocabulariesKeyByCollectionName)) {
      try {
        const dtos: CreateProviderCollectionDto[] =
          dtosOrVocabulariesKeyByCollectionName;
        await this.providerCollectionModel.insertMany(dtos, {
          limit: LIMIT_PER_BULK_WRITE,
        });
      } catch (error) {
        this.logger.error(error);
        throw new UnprocessableEntityException(
          'There are error while processing bulk insert provider collections',
        );
      }
    } else {
      const vocabulariesKeyByCollectionName: Map<string, CreateVocabDto[]> =
        dtosOrVocabulariesKeyByCollectionName;

      const collectionNames = Array.from(
        vocabulariesKeyByCollectionName.keys(),
      );

      const collections = await this.findManyAndCreateIfMissing(
        collectionNames,
      );

      for (const collection of collections) {
        const name = collection.name;
        if (vocabulariesKeyByCollectionName.has(name)) {
          const vocabNames = (
            vocabulariesKeyByCollectionName.get(name) as CreateVocabDto[]
          ).map((vocab) => vocab.word);

          const vocabs = await this.vocabularyService.findByWords(vocabNames);
          const vocabIds = vocabs.map((vocab) => vocab._id);
          collection.vocabularies = vocabIds;
        }
      }

      await this.providerCollectionModel.bulkWrite(
        this.toBulkWriteOperation(collections),
      );
    }
  }

  async findManyAndCreateIfMissing(
    names: string[],
  ): Promise<(LeanDocument<ProviderCollection> & ObjectId)[]> {
    const collections = await this.providerCollectionModel
      .find({
        name: { $in: names },
      })
      .lean()
      .exec();

    if (collections.length !== names.length) {
      const newCollectionDtos = names.reduce(
        (dtos: CreateProviderCollectionDto[], name: string) => {
          if (
            isEmpty(collections) ||
            collections.some((collection) => collection.name !== name)
          ) {
            dtos.push({ name, fee: 0 });
          }
          return dtos;
        },
        [],
      );

      const newCollections = await this.providerCollectionModel.insertMany(
        newCollectionDtos,
        {
          limit: LIMIT_PER_BULK_WRITE,
          lean: true,
        },
      );
      return collections.concat(newCollections);
    }

    return collections;
  }

  private toBulkWriteOperation(
    data: (LeanDocument<ProviderCollection> & ObjectId)[],
  ): BulkWriteOperation[] {
    return data.map((item) => {
      return {
        updateOne: {
          filter: {
            _id: item._id,
          },
          update: {
            $set: {
              vocabularies: item.vocabularies,
            },
          },
          upsert: true,
        },
      };
    });
  }

  findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<ProviderCollection>>> {
    const query = this.providerCollectionModel
      .find<ProviderCollection>()
      .populate('vocabularies')
      .lean();

    const request = new CursorConnectionRequestBuilder({
      query,
      paginationArguments: args,
    });

    return this.cursorConnectionExecutor.buildConnection(request);
  }
}
