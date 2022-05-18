import { LIMIT_PER_BULK_WRITE } from '@mongoose/constant';
import { BulkWriteOperation } from '@mongoose/operation.type';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Definition } from '@vocabulary-client/definition.model';
import { CreateVocabInput } from '@vocabulary-client/dto/create-vocab.input';
import { Vocabulary } from '@vocabulary-client/vocabulary.model';
import { VocabularyService } from '@vocabulary-client/vocabulary.service';
import { keyBy, uniqBy } from 'lodash';
import { Model, Types } from 'mongoose';

export class VocabularyServiceImpl implements VocabularyService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(Vocabulary.name)
    private readonly vocabularyModel: Model<Vocabulary>,
  ) {
    this.logger = new Logger(VocabularyServiceImpl.name);
  }

  public async findByWords(words: string[]) {
    return this.vocabularyModel.find({
      word: {
        $in: words,
      },
    });
  }

  public findByIds(ids: Types.ObjectId[]) {
    return this.vocabularyModel
      .find({
        _id: ids,
      })
      .lean()
      .exec();
  }

  public async createMany(vocabularies: CreateVocabInput[]): Promise<void> {
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

  public async upsertMany(createDtos: CreateVocabInput[]): Promise<void> {
    const words = createDtos.map((dto) => dto.word);
    const existedVocabularies = await this.findByWords(words);

    const vocabularyKeyByWord = keyBy(existedVocabularies, 'word');

    const preparedData = createDtos.map((dto) => {
      const existedVocabulary = vocabularyKeyByWord[dto.word];

      if (!!existedVocabulary) {
        existedVocabulary.definitions.push(
          ...(dto.definitions as Definition[]),
        );
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
  private toBulkWriteOperation(data: CreateVocabInput[]): BulkWriteOperation[] {
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
