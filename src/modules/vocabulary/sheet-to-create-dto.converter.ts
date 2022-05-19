import { CreateVocabInput } from '@vocabulary-client/entities/input/create-vocab.input';

interface ClientSheetRow {
  word: string;
  collection: string;
  meaning: string;
  example: string;
  roadmap: string;
}

export class SheetRowsConverter {
  public static convert(
    sheetRows: Partial<ClientSheetRow>[],
  ): CreateVocabInput[] {
    return sheetRows.map((row) => {
      return {
        word: row.word ?? '',
        definitions: [
          {
            meaning: row.meaning ?? '',
            type: '',
            examples: row.example ? [row.example] : [],
          },
        ],
      } as CreateVocabInput;
    });
  }
}
