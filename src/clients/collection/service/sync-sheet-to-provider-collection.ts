import { FileUploadDto } from '@vocabulary-client/entities/file-upload.dto';

export const SyncSheetToProviderCollectionToken =
  'SyncSheetToProviderCollectionToken';

export interface SyncSheetToProviderCollection {
  sync(fileUpload: FileUploadDto): Promise<void>;
}
