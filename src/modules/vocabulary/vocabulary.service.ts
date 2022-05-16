import { BulkWriteOperation } from '@mongoose/operation.type';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import {
  Vocabulary,
  VocabularyDocument,
} from '@vocabulary-client/vocabulary.model';
import { VocabularyService } from '@vocabulary-client/vocabulary.service';
import { keyBy, uniqBy } from 'lodash';
import { Model } from 'mongoose';
import { LIMIT_PER_BULK_WRITE } from './../mongoose/constant';

export class VocabularyServiceImpl implements VocabularyService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(Vocabulary.name)
    private readonly vocabularyModel: Model<VocabularyDocument>,
  ) {
    this.logger = new Logger(VocabularyServiceImpl.name);
  }

  async findByWords(words: string[]) {
    return this.vocabularyModel.find({
      word: {
        $in: words,
      },
    });
  }

  async createMany(vocabularies: CreateVocabDto[]): Promise<void> {
    try {
      await this.vocabularyModel.insertMany(vocabularies, {
        limit: LIMIT_PER_BULK_WRITE,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'There are error while processing bulk insert vocabularies',
      );
    }
  }

  async upsertMany(createDtos: CreateVocabDto[]): Promise<void> {
    const words = createDtos.map((dto) => dto.word);
    const existedVocabularies = await this.findByWords(words);

    const vocabularyKeyByWord = keyBy(existedVocabularies, 'word');

    const preparedData = createDtos.map((dto) => {
      const existedVocabulary = vocabularyKeyByWord[dto.word];

      if (!!existedVocabulary) {
        existedVocabulary.definitions.push(...dto.definitions);
        existedVocabulary.definitions = uniqBy(
          existedVocabulary.definitions,
          'meaning',
        );

        return existedVocabulary;
      }
      return dto;
    });

    await this.vocabularyModel.bulkWrite(
      this.toBulkWriteOperation(preparedData),
    );
  }

  // TODO: Separate this operation into mongoose module
  private toBulkWriteOperation(data: CreateVocabDto[]): BulkWriteOperation[] {
    return data.map((item) => {
      return {
        updateOne: {
          filter: {
            word: item.word,
          },
          update: {
            $set: {
              definitions: item.definitions,
            },
          },
          upsert: true,
        },
      };
    });
  }
}
