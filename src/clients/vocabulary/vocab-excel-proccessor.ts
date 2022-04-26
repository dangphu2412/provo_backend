import { CsvUtils } from '@excel/csv.utils';
import { WorkBookReader } from '@excel/work-book-reader';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class CsvParser {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(CsvParser.name);
  }

  public async process(fileUpload: FileUpload) {
    const workBookReader = new WorkBookReader(fileUpload);

    try {
      const workBook = await workBookReader.read();
      const sheet = workBook.sheets[workBook.sheetNames[0]];
      return CsvUtils.fromSheetToJson(sheet);
    } catch (error) {
      this.logger.error(error);
      throw new UnprocessableEntityException(
        'Error while trying to process excel file data. Please contact admin to solve this problem',
      );
    } finally {
      workBookReader.clean();
    }
  }
}
