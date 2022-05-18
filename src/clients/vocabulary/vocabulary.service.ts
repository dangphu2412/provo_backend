import { ObjectId } from '@mongoose/type';
import { LeanDocument, Types } from 'mongoose';
import { CreateVocabInput } from './dto/create-vocab.input';
import { Vocabulary } from './vocabulary.model';

export const VocabularyServiceToken = 'VocabularyService';

export interface VocabularyService {
  createMany(vocabularies: CreateVocabInput[]): Promise<void>;
  findByWords(words: string[]): Promise<(Vocabulary & ObjectId)[]>;
  findByIds(
    ids: Types.ObjectId[],
  ): Promise<LeanDocument<Vocabulary & ObjectId>[]>;
  upsertMany(vocabularies: CreateVocabInput[]): Promise<void>;
}
