import { JwtAuthGuard } from '@auth/jwt.guard';
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
import { FileUploadDto } from '@vocabulary-client/entities/file-upload.dto';
import { VocabularyType } from '@vocabulary-client/entities/object-type/vocabulary.type';
import { VocabularyLoader } from '@vocabulary/vocabulary-loader';
import { GraphQLUpload } from 'graphql-upload';
import { ProviderCollectionConnection } from './entities/object-type/provider-collection.connection';
import { ProviderCollectionType } from './entities/object-type/provider-collection.type';
import {
  ProviderCollectionService,
  ProviderCollectionServiceToken,
} from './service/provider-collection.service';
import {
  SyncSheetToProviderCollection,
  SyncSheetToProviderCollectionToken,
} from './service/sync-sheet-to-provider-collection';

@Resolver(() => ProviderCollectionType)
export class ProviderCollectionResolver {
  constructor(
    @Inject(ProviderCollectionServiceToken)
    private readonly providerCollectionService: ProviderCollectionService,
    @Inject(SyncSheetToProviderCollectionToken)
    private readonly syncSheetToProviderCollection: SyncSheetToProviderCollection,
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
    await this.syncSheetToProviderCollection.sync(fileUpload);
  }
}
