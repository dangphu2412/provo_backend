import { Inject, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CursorConnectionExecutor,
  CursorConnectionExecutorToken,
} from '@pagination/cursor-connection-excutor';
import { CursorConnectionRequestBuilder } from '@pagination/cursor-connection-request';
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
    @Inject(CursorConnectionExecutorToken)
    private readonly cursorConnectionExecutor: CursorConnectionExecutor,
  ) {
    this.logger = new Logger(VocabularyServiceImpl.name);
  }

  async findByWords(words: string[]) {
    return this.vocabularyModel
      .find({
        word: {
          $in: words,
        },
      })
      .lean();
  }

  async search(args: VocabularyArgs) {
    const query = this.vocabularyModel
      .find<VocabularyDocument>(
        args.search
          ? {
              $text: {
                $search: args.search,
              },
            }
          : {},
      )
      .lean();

    const request = new CursorConnectionRequestBuilder({
      query,
      paginationArguments: args,
    });

    return this.cursorConnectionExecutor.buildConnection(request);
  }

  async createMany(vocabularies: CreateVocabDto[]): Promise<void> {
    try {
      await this.vocabularyModel.insertMany(vocabularies, {
        limit: VocabularyServiceImpl.LIMIT_RECORD_PER_INSERT,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'There are error while processing bulk insert vocabularies',
      );
    }
  }
}
