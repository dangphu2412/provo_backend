import { CreateVocabDto } from './dto/create-vocab.dto';
import { Vocabulary } from './vocabulary.model';

export const VocabularyServiceToken = 'VocabularyService';

export interface VocabularyService {
  createMany(vocabularies: CreateVocabDto[]): Promise<void>;
  search(text: string): Promise<Vocabulary[]>;
}
