import { JwtAuthGuard } from '@auth/jwt.guard';
import { SheetProcessor } from '@excel/sheet-reader';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { CreateVocabInput } from '@vocabulary-client/dto/create-vocab.input';
import { FileUploadDto } from '@vocabulary-client/dto/file-upload.dto';
import { VocabularyType } from '@vocabulary-client/dto/vocabulary.type';
import { mapSheetRowsToCreateVocabDtos } from '@vocabulary-client/sheet-to-create-dto.mapper';
import { VocabularyLoader } from '@vocabulary-client/vocabulary-loader';
import {
  VocabularyService,
  VocabularyServiceToken,
} from '@vocabulary-client/vocabulary.service';
import { GraphQLUpload } from 'graphql-upload';
import { ProviderCollectionConnection } from './entities/object-type/provider-collection.connection';
import { ProviderCollectionType } from './entities/object-type/provider-collection.type';
import {
  ProviderCollectionService,
  ProviderCollectionServiceToken,
} from './service/provider-collection.service';

@Resolver(() => ProviderCollectionType)
export class ProviderCollectionResolver {
  constructor(
    @Inject(ProviderCollectionServiceToken)
    private readonly providerCollectionService: ProviderCollectionService,
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
    private readonly vocabularyLoader: VocabularyLoader,
  ) {}

  @Query(() => ProviderCollectionConnection, {
    name: 'providerCollections',
  })
  @UseGuards(JwtAuthGuard)
  getProviderCollections(@Args() args: PaginationArgs) {
    return this.providerCollectionService.findMany(args);
  }

  @ResolveField('vocabularies', () => [VocabularyType])
  async getVocabularies(@Parent() providerCollection: ProviderCollectionType) {
    return this.vocabularyLoader.loadMany(providerCollection.vocabularies);
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async uploadVocabularies(
    @Args({
      name: 'file',
      type: () => GraphQLUpload,
    })
    fileUpload: FileUploadDto,
  ) {
    const sheetProcessor = new SheetProcessor(fileUpload);
    const vocabulariesKeyByCollectionName = new Map<
      string,
      CreateVocabInput[]
    >();

    sheetProcessor.define(async (rows) => {
      const dtos = mapSheetRowsToCreateVocabDtos(rows);
      await this.vocabularyService.upsertMany(dtos);
      const collectionName = rows[0].collection;
      if (!!collectionName) {
        vocabulariesKeyByCollectionName.set(collectionName, dtos);
      }
    });

    await sheetProcessor.process();

    await this.providerCollectionService.createMany(
      vocabulariesKeyByCollectionName,
    );
  }
}
