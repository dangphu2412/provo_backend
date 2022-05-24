import { Role } from '@auth/auth.constant';
import { JwtAuthGuard } from '@auth/jwt.guard';
import { RequireRoles } from '@auth/require-role.decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { FileUploadDto } from '@vocabulary-client/entities/file-upload.dto';
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

  // TODO: Discuss about how to deal with roadmaps
  // @ResolveField('roadmaps', () => [VocabularyType])
  // async getVocabularies(@Parent() providerCollection: ProviderCollectionType) {
  //   return this.vocabularyLoader.loadMany(providerCollection.roadmaps);
  // }

  @Mutation(() => Boolean, { nullable: true })
  @RequireRoles(Role.ADMIN)
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
