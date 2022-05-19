import { ObjectId } from '@mongoose/type';
import { LeanDocument, Types } from 'mongoose';
import { CreateVocabInput } from './entities/input/create-vocab.input';
import { Vocabulary } from './entities/model/vocabulary.model';

export const VocabularyServiceToken = 'VocabularyService';

export interface VocabularyService {
  createMany(vocabularies: CreateVocabInput[]): Promise<void>;
  findByWords(words: string[]): Promise<(Vocabulary & ObjectId)[]>;
  findByIds(
    ids: Types.ObjectId[],
  ): Promise<LeanDocument<Vocabulary & ObjectId>[]>;
  upsertMany(vocabularies: CreateVocabInput[]): Promise<void>;
}
