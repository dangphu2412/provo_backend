import { CreateVocabInput } from '@vocabulary-client/entities/input/create-vocab.input';

interface ClientSheetRow {
  word: string;
  collection: string;
  meaning: string;
  example: string;
  roadmap: string;
}

export interface VocabMisc {
  wordsKeyByDay: Map<string, string[]>;
  vocabularies: CreateVocabInput[];
}

function isValidRow(row: Partial<ClientSheetRow>): row is ClientSheetRow {
  return (
    !!row.word &&
    !!row.collection &&
    !!row.meaning &&
    !!row.example &&
    !!row.roadmap
  );
}

export class SheetRowsConverter {
  public static convert(sheetRows: Partial<ClientSheetRow>[]): VocabMisc {
    const misc: VocabMisc = {
      wordsKeyByDay: new Map(),
      vocabularies: [],
    };

    sheetRows.forEach((row) => {
      isValidRow(row);
      const vocab = {
        word: row.word as string,
        definitions: [
          {
            meaning: row.meaning as string,
            type: '',
            examples: row.example ? [row.example] : [],
          },
        ],
      } as CreateVocabInput;

      misc.vocabularies.push(vocab);
      if (!misc.wordsKeyByDay.has(row.roadmap as string)) {
        misc.wordsKeyByDay.set(row.roadmap as string, []);
      } else {
        (misc.wordsKeyByDay.get(row.roadmap as string) as string[]).push(
          row.word as string,
        );
      }
    });

    return misc;
  }
}
