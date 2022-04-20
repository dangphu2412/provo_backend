import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphqlConnection } from '@pagination/pagination';
import { compile } from '@pagination/query-compiler';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import { VocabularyArgs } from '@vocabulary-client/dto/vocabulary.arg';
import {
  Vocabulary,
  VocabularyDocument,
} from '@vocabulary-client/vocabulary.model';
import { VocabularyService } from '@vocabulary-client/vocabulary.service';
import { Model } from 'mongoose';

export class VocabularyServiceImpl implements VocabularyService {
  private static LIMIT_RECORD_PER_INSERT = 100;

  private readonly logger: Logger;

  constructor(
    @InjectModel(Vocabulary.name)
    private readonly vocabularyModel: Model<VocabularyDocument>,
  ) {
    this.logger = new Logger(VocabularyServiceImpl.name);
  }

  async search(
    args: VocabularyArgs,
  ): Promise<GraphqlConnection<VocabularyDocument>> {
    return compile(this.vocabularyModel, args);
  }

  async createMany(vocabularies: CreateVocabDto[]): Promise<void> {
    try {
      await this.vocabularyModel.insertMany(vocabularies, {
        limit: VocabularyServiceImpl.LIMIT_RECORD_PER_INSERT,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'There are duplicate vocabularies',
      );
    }
  }
}
