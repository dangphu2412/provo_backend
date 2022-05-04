import { SheetReader } from '@excel/sheet-reader';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { mapSheetRowsToCreateVocabDtos } from './sheet-to-create-dto.mapper';
import {
  VocabularyService,
  VocabularyServiceToken,
} from './vocabulary.service';
@Resolver()
export class VocabularyResolver {
  constructor(
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {}

  @Mutation(() => Boolean, { nullable: true })
  async createVocabularies(
    @Args({
      name: 'vocabularies',
      type: () => [CreateVocabDto],
    })
    createVocabulariesDto: CreateVocabDto[],
  ) {
    await this.vocabularyService.createMany(createVocabulariesDto);
  }

  @Mutation(() => Boolean, { nullable: true })
  async uploadVocabularies(
    @Args({
      name: 'file',
      type: () => GraphQLUpload,
    })
    fileUpload: FileUploadDto,
  ) {
    const sheetReader = new SheetReader(fileUpload);

    sheetReader.each(async (rows) => {
      const dtos = mapSheetRowsToCreateVocabDtos(rows);
      await this.vocabularyService.upsertMany(dtos);
    });

    await sheetReader.read();

    // TODO: Create collection collect words from sheetRows
  }
}
