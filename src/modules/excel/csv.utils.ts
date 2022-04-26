import { utils, WorkSheet } from 'xlsx';

export class CsvUtils {
  public static fromSheetToJson(
    sheet: WorkSheet,
  ): Record<string | number | symbol, string | null>[] {
    return utils.sheet_to_json(sheet, {
      raw: true,
      defval: null,
    });
  }
}
