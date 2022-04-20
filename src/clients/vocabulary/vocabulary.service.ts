import { GraphqlConnection } from '@pagination/pagination';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { VocabularyArgs } from './dto/vocabulary.arg';
import { VocabularyDocument } from './vocabulary.model';

export const VocabularyServiceToken = 'VocabularyService';

export interface VocabularyService {
  createMany(vocabularies: CreateVocabDto[]): Promise<void>;
  search(args: VocabularyArgs): Promise<GraphqlConnection<VocabularyDocument>>;
}
