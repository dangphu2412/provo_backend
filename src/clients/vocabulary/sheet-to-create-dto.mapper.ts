import { CreateVocabDto } from './dto/create-vocab.dto';

interface ClientSheetRow {
  word: string;
  collection: string;
  meaning: string;
  example: string;
  roadmap: string;
}

export function mapSheetRowsToCreateVocabDtos(
  sheetRows: Partial<ClientSheetRow>[],
): CreateVocabDto[] {
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
    } as CreateVocabDto;
  });
}
