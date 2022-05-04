export const VocabularySearchServiceToken = 'VocabSearchServiceToken';

export interface VocabularySearchDocument {
  _id: string;
  word: string;
}

export interface VocabularySearchService {
  index(documents: VocabularySearchDocument[]): Promise<void>;
  search(query: string): Promise<VocabularySearchDocument[]>;
}
