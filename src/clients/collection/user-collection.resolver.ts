import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import { AddVocabularyToCollectionInput } from './dto/add-vocabulary-to-collection.input';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UserCollectionConnection } from './dto/user-collection.connection';
import { UserCollectionType } from './dto/user-collection.type';
import {
  UserCollectionService,
  UserCollectionServiceToken,
} from './service/user-collection.service';

@Resolver(() => UserCollectionType)
export class UserCollectionResolver {
  constructor(
    @Inject(UserCollectionServiceToken)
    private readonly userCollectionService: UserCollectionService,
  ) {}

  @Query(() => UserCollectionConnection, {
    name: 'selfCollections',
  })
  async getSelfCollections(@Args() args: PaginationArgs) {
    const data = await this.userCollectionService.findMany(args);
    console.log(data.edges[0].node);
    return data;
  }

  @Mutation(() => Boolean)
  async createSelfCollection(
    @Args('createCollectionDto') dto: CreateCollectionDto,
  ) {
    await this.userCollectionService.createOne(dto);
    return true;
  }

  @Mutation(() => Boolean)
  async addVocabularyToCollection(
    @Args('addVocabularyToCollectionInput')
    input: AddVocabularyToCollectionInput,
  ) {
    await this.userCollectionService.addVocabularyToCollection(input);
    return true;
  }
}
