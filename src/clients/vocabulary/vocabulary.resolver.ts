import { SheetReader } from '@excel/sheet-reader';
import { Inject, UnprocessableEntityException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { VocabularyArgs } from './dto/vocabulary.arg';
import { VocabularyConnection } from './dto/vocabulary.connection';
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
    const sheetReader = new SheetReader(fileUpload);

    sheetReader.each(async (rows) => {
      const dtos = mapSheetRowsToCreateVocabDtos(rows);
      const words = dtos.map((dto) => dto.word);
      const vocabs = await this.vocabularyService.findByWords(words);
      if (vocabs.length > 0) {
        throw new UnprocessableEntityException(
          'Vocabularies were already existed: ' +
            vocabs.map((v) => v.word).join(', '),
        );
      }
      await this.vocabularyService.createMany(dtos);
    });

    await sheetReader.read();

    // TODO: Create collection collect words from sheetRows
  }
}
