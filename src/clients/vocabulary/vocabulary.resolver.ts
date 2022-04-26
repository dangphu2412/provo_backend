import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { VocabularyArgs } from './dto/vocabulary.arg';
import { VocabularyConnection } from './dto/vocabulary.connection';
import { mapSheetRowsToCreateVocabDtos } from './sheet-to-create-dto.mapper';
import { CsvParser } from './vocab-excel-proccessor';
import {
  VocabularyService,
  VocabularyServiceToken,
} from './vocabulary.service';
@Resolver()
export class VocabularyResolver {
  constructor(
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
    private readonly vocabExcelProcessor: CsvParser,
  ) {}

  @Query(() => VocabularyConnection)
  async searchVocabularies(@Args() args: VocabularyArgs) {
    return this.vocabularyService.search(args);
  }

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
    const sheetRows = await this.vocabExcelProcessor.process(fileUpload);

    await this.vocabularyService.createMany(
      mapSheetRowsToCreateVocabDtos(sheetRows),
    );

    // TODO: Create collection collect words from sheetRows
  }
}
