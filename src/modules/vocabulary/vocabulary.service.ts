import { Inject, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import { VocabularyArgs } from '@vocabulary-client/dto/vocabulary.arg';
import {
  Vocabulary,
  VocabularyDocument,
} from '@vocabulary-client/vocabulary.model';
import { VocabularyService } from '@vocabulary-client/vocabulary.service';
import { Model } from 'mongoose';
import {
  CursorPaginationBuilderToken,
  CursorPaginationQueryBuilder,
} from '../pagination/cursor-pagination.builder';

export class VocabularyServiceImpl implements VocabularyService {
  private static LIMIT_RECORD_PER_INSERT = 100;

  private readonly logger: Logger;

  constructor(
    @InjectModel(Vocabulary.name)
    private readonly vocabularyModel: Model<VocabularyDocument>,
    @Inject(CursorPaginationBuilderToken)
    private readonly cursorPaginationQueryBuilder: CursorPaginationQueryBuilder,
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

    const countQuery = query.clone().count();

    const [result, totalCount] = await Promise.all([
      this.cursorPaginationQueryBuilder.build(query, args),
      countQuery,
    ]);

    const edges = this.cursorPaginationQueryBuilder.buildEdges(result);

    return this.cursorPaginationQueryBuilder.buildConnection({
      edges,
      paginationArgs: args,
      totalCount,
    });
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
