import { CreateProviderCollectionDto } from '@collection-client/entities/create-provider-collection.dto';
import { ProviderCollection } from '@collection-client/entities/model/provider-collection.model';
import { ProviderCollectionService } from '@collection-client/service/provider-collection.service';
import { BulkWriteOperation } from '@mongoose/operation.type';
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
import {
  VocabularyService,
  VocabularyServiceToken,
} from '@vocabulary-client/vocabulary.service';
import { LeanDocument, Model, Types } from 'mongoose';

export class ProviderCollectionServiceImpl
  implements ProviderCollectionService
{
  private readonly logger: Logger;

  constructor(
    @InjectModel(ProviderCollection.name)
    private readonly providerCollectionModel: Model<ProviderCollection>,
    @Inject(CursorConnectionExecutorToken)
    private readonly cursorConnectionExecutor: CursorConnectionExecutor,
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {
    this.logger = new Logger(ProviderCollectionServiceImpl.name);
  }

  async createMany(dtos: CreateProviderCollectionDto[]): Promise<void> {
    const vocabularyIds = this.extractVocabularyIds(dtos);

    const vocabularies = await this.vocabularyService.findByIds(vocabularyIds);

    if (vocabularyIds.length !== vocabularies.length) {
      throw new UnprocessableEntityException(
        'There are some vocabulary ids not found',
      );
    }

    await this.providerCollectionModel.bulkWrite(
      this.toBulkWriteOperation(dtos),
    );
  }

  private extractVocabularyIds(
    dtos: CreateProviderCollectionDto[],
  ): Types.ObjectId[] {
    const vocabularyObjectIds = new Map<string, Types.ObjectId>();

    dtos.forEach((dto) => {
      Object.keys(dto.roadmaps).forEach((day) => {
        const vocabularyIds = dto.roadmaps[day];
        vocabularyIds.forEach((id) => {
          vocabularyObjectIds.set(id.toHexString(), id);
        });
      });
    });

    return [...vocabularyObjectIds.values()];
  }

  private toBulkWriteOperation(
    data: CreateProviderCollectionDto[],
  ): BulkWriteOperation<LeanDocument<ProviderCollection> & ObjectId>[] {
    return data.map((item) => {
      return {
        insertOne: {
          document: item,
        },
      };
    });
  }

  public findMany(
    args: PaginationArgs,
  ): Promise<GraphqlConnection<LeanDocument<ProviderCollection>>> {
    const query = this.providerCollectionModel
      .find<ProviderCollection>()
      .lean();

    const request = new CursorConnectionRequestBuilder({
      query,
      paginationArguments: args,
    });

    return this.cursorConnectionExecutor.buildConnection(request);
  }
}
