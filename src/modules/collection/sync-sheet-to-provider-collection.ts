import { Types } from 'mongoose';
import { CreateProviderCollectionDto } from '@collection-client/entities/create-provider-collection.dto';
import {
  ProviderCollectionServiceToken,
  ProviderCollectionService,
} from '@collection-client/service/provider-collection.service';
import { SyncSheetToProviderCollection } from '@collection-client/service/sync-sheet-to-provider-collection';
import { SheetProcessor } from '@excel/sheet-reader';
import { Inject } from '@nestjs/common';
import { FileUploadDto } from '@vocabulary-client/entities/file-upload.dto';
import {
  VocabularyServiceToken,
  VocabularyService,
} from '@vocabulary-client/vocabulary.service';
import { SheetRowsConverter } from '@vocabulary/sheet-to-create-dto.converter';

export class SyncSheetToProviderCollectionImpl
  implements SyncSheetToProviderCollection
{
  constructor(
    @Inject(ProviderCollectionServiceToken)
    private readonly providerCollectionService: ProviderCollectionService,
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {}

  async sync(fileUpload: FileUploadDto): Promise<void> {
    const NO_FEE = 0; // Currently we still not provide checkout feature
    const sheetProcessor = new SheetProcessor(fileUpload);
    const createProviderCollectionDtos: CreateProviderCollectionDto[] = [];

    sheetProcessor.define(async (rows, sheetName) => {
      const vocabMisc = SheetRowsConverter.convert(rows);

      await this.vocabularyService.upsertMany(vocabMisc.vocabularies);

      if (!!sheetName) {
        const roadmaps: Record<string, Types.ObjectId[]> = {};

        for (const [day, words] of vocabMisc.wordsKeyByDay.entries()) {
          const vocabularies = await this.vocabularyService.findByWords(words);
          const vocabularyObjectIds = vocabularies.map(
            (vocabulary) => vocabulary._id,
          );
          roadmaps[day] = vocabularyObjectIds;
        }

        const dto = new CreateProviderCollectionDto();
        dto.name = sheetName;
        dto.fee = NO_FEE;
        dto.roadmaps = roadmaps;
        createProviderCollectionDtos.push(dto);
      }
    });

    await sheetProcessor.process();

    await this.providerCollectionService.createMany(
      createProviderCollectionDtos,
    );
  }
}
