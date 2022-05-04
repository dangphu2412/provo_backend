import { isString } from 'lodash';
import { CreateVocabDto } from './dto/create-vocab.dto';

interface ClientSheetRow {
  collection: string | null;
  word: string | null;
  type: string | null;
  meaning: string | null;
  example: string | null;
  [key: string]: string | null;
}

export function mapSheetRowsToCreateVocabDtos(
  sheetRows: Partial<ClientSheetRow>[],
): CreateVocabDto[] {
  return sheetRows
    .map((sheetRow) => ({
      word: sheetRow.word ?? '',
      definitions: sheetRow.meaning ? [sheetRow.meaning] : [],
      examples: isString(sheetRow.example) ? [sheetRow.example] : [],
    }))
    .filter(({ word }) => !!word);
}
