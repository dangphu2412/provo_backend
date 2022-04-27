import { CsvUtils } from '@excel/csv.utils';
import { WorkBookReader } from '@excel/work-book-reader';
import { FileUpload } from 'graphql-upload';
import { SheetRows } from './sheet-rows';

export type SheetConsumer = (sheetRows: SheetRows) => Promise<void>;

export class SheetReader {
  private workBookReader: WorkBookReader;
  private consumer: SheetConsumer;

  constructor(fileUpload: FileUpload) {
    this.workBookReader = new WorkBookReader(fileUpload);
  }

  public each(action: SheetConsumer) {
    this.consumer = action;
  }

  public async start() {
    const workBook = await this.workBookReader.read();

    for (const sheetName of workBook.sheetNames) {
      try {
        const sheet = workBook.sheets[sheetName];
        const sheetRows = CsvUtils.fromSheetToRows(sheet);
        await this.consumer(sheetRows);
      } catch (error) {
        this.workBookReader.clean();
        throw error;
      }
    }
    this.workBookReader.clean();
  }
}
