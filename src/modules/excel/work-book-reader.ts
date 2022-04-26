import { createWriteStream } from 'fs';
import { access, unlink } from 'fs/promises';
import { FileUpload } from 'graphql-upload';
import { finished } from 'stream/promises';
import {
  FullProperties,
  readFile,
  WBProps,
  WorkBook as XLSXWorkBook,
  WorkSheet,
} from 'xlsx';

export interface WorkBook {
  sheets: { [sheet: string]: WorkSheet };

  sheetNames: string[];

  props?: FullProperties;

  customProps?: object;

  workBook?: WBProps;

  vbaraw?: any;
}

export class WorkBookReader {
  private readonly filePath: string;

  constructor(private readonly fileUpload: FileUpload) {
    this.filePath = this.generateTempPath();
  }

  private generateTempPath(): string {
    return `${process.cwd()}/${this.fileUpload.filename}`;
  }

  async read(): Promise<WorkBook> {
    const readStream = this.fileUpload.createReadStream();
    const outputStream = createWriteStream(this.filePath);

    readStream.pipe(outputStream);

    await finished(outputStream);

    const xlsxWorkBook = readFile(this.filePath, {
      type: 'buffer',
    });

    return this.toWorkBook(xlsxWorkBook);
  }

  private toWorkBook(workBook: XLSXWorkBook): WorkBook {
    return {
      sheets: workBook.Sheets,
      sheetNames: workBook.SheetNames,
      props: workBook.Props,
      customProps: workBook.Custprops,
      workBook: workBook.Workbook,
      vbaraw: workBook.vbaraw,
    };
  }

  async clean(): Promise<void> {
    try {
      await access(this.filePath);
      await unlink(this.filePath);
    } catch (error) {
      throw new Error('Cannot cleanup file path after reading worksheet');
    }
  }
}
