import { CsvUtils } from '@excel/csv.utils';
import { WorkBookReader } from '@excel/work-book-reader';
import { FileUpload } from 'graphql-upload';
import { SheetRows } from './sheet-rows';

export type SheetConsumer = (
  sheetRows: SheetRows,
  sheetName: string,
) => Promise<void>;

export class SheetProcessor {
  private workBookReader: WorkBookReader;
  private consumer: SheetConsumer;

  constructor(fileUpload: FileUpload) {
    this.workBookReader = new WorkBookReader(fileUpload);
  }

  public define(action: SheetConsumer) {
    this.consumer = action;
  }

  public async process() {
    const workBook = await this.workBookReader.read();

    for (const sheetName of workBook.sheetNames) {
      try {
        const sheet = workBook.sheets[sheetName];
        const sheetRows = CsvUtils.fromSheetToRows(sheet);
        await this.consumer(sheetRows, sheetName);
      } catch (error) {
        this.workBookReader.clean();
        throw error;
      }
    }
    this.workBookReader.clean();
  }
}
