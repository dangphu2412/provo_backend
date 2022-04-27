import { utils, WorkSheet } from 'xlsx';
import { SheetRows } from './sheet-rows';

export class CsvUtils {
  public static fromSheetToRows(sheet: WorkSheet): SheetRows {
    return utils.sheet_to_json(sheet, {
      raw: true,
      defval: null,
    });
  }
}
