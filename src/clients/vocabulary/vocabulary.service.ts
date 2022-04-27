import { LeanDocument } from 'mongoose';
import { GraphqlConnection } from '@pagination/connection.factory';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { VocabularyArgs } from './dto/vocabulary.arg';
import { VocabularyDocument } from './vocabulary.model';

export const VocabularyServiceToken = 'VocabularyService';

export interface VocabularyService {
  createMany(vocabularies: CreateVocabDto[]): Promise<void>;
  search(
    args: VocabularyArgs,
  ): Promise<GraphqlConnection<LeanDocument<VocabularyDocument>>>;
  findByWords(words: string[]): Promise<LeanDocument<VocabularyDocument>[]>;
}
