import { ObjectId } from '@mongoose/type';
import { LeanDocument, Types } from 'mongoose';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { Vocabulary, VocabularyDocument } from './vocabulary.model';

export const VocabularyServiceToken = 'VocabularyService';

export interface VocabularyService {
  createMany(vocabularies: CreateVocabDto[]): Promise<void>;
  findByWords(words: string[]): Promise<
    (VocabularyDocument & {
      _id: any;
    })[]
  >;
  findByIds(
    ids: Types.ObjectId[],
  ): Promise<LeanDocument<Vocabulary & ObjectId>[]>;
  upsertMany(vocabularies: CreateVocabDto[]): Promise<void>;
}
