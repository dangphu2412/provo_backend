import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import { Vocabulary } from '@vocabulary-client/vocabulary.model';
import { VocabularyService } from '@vocabulary-client/vocabulary.service';
import { Model } from 'mongoose';

export class VocabularyServiceImpl implements VocabularyService {
  private static LIMIT_RECORD_PER_INSERT = 100;

  private readonly logger: Logger;

  constructor(
    @InjectModel(Vocabulary.name)
    private readonly vocabularyModel: Model<Vocabulary>,
  ) {
    this.logger = new Logger(VocabularyServiceImpl.name);
  }

  async search(text: string): Promise<Vocabulary[]> {
    return await this.vocabularyModel.find({
      $text: {
        $search: text,
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
        'There are duplicate vocabularies',
      );
    }
  }
}
