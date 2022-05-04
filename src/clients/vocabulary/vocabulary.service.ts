import { CreateVocabDto } from './dto/create-vocab.dto';
import { VocabularyDocument } from './vocabulary.model';

export const VocabularyServiceToken = 'VocabularyService';

export interface VocabularyService {
  createMany(vocabularies: CreateVocabDto[]): Promise<void>;
  findByWords(words: string[]): Promise<
    (VocabularyDocument & {
      _id: any;
    })[]
  >;
  upsertMany(vocabularies: CreateVocabDto[]): Promise<void>;
}
