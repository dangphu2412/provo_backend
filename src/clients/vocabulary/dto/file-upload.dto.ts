import { IsIn, IsString } from 'class-validator';
import { ReadStream } from 'fs-capacitor';
import { FileUpload } from 'graphql-upload';

const SHEET_MIMETYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export class FileUploadDto implements FileUpload {
  @IsString()
  public filename: string;

  @IsIn([SHEET_MIMETYPE])
  public mimetype: string;

  @IsString()
  public encoding: string;

  public createReadStream: () => ReadStream;
}
