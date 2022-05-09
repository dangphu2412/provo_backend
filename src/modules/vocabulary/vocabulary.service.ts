import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import {
  Vocabulary,
  VocabularyDocument,
} from '@vocabulary-client/vocabulary.model';
import { VocabularyService } from '@vocabulary-client/vocabulary.service';
import { isEmpty } from 'lodash';
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
        limit: VocabularyServiceImpl.LIMIT_RECORD_PER_INSERT,
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
    let newDtos = createDtos;

    if (!isEmpty(existedVocabularies)) {
      newDtos = createDtos.filter(this.isDtoNotExistIn(existedVocabularies));

      existedVocabularies.forEach((vocabulary) => {
        const matchedDto = createDtos.find(
          (dto) => dto.word === vocabulary.word,
        );

        if (
          !!matchedDto &&
          !isEmpty(matchedDto.definitions) &&
          !!matchedDto.definitions[0]
        ) {
          vocabulary.definitions.push(matchedDto.definitions[0]);
          vocabulary.definitions = [...new Set(vocabulary.definitions)];
        }
      });
    }

    await Promise.all([
      this.vocabularyModel.bulkSave(existedVocabularies),
      this.createMany(newDtos),
    ]);
  }

  private isDtoNotExistIn(
    existedVocabularies: (VocabularyDocument & {
      _id: any;
    })[],
  ) {
    return (dto: CreateVocabDto) =>
      !existedVocabularies.some((vocabulary) => vocabulary.word === dto.word);
  }
}
