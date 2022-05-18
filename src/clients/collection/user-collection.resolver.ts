import { UserFromAuth } from '@auth-client/entities/current-user';
import { JwtAuthGuard } from '@auth/jwt.guard';
import { CurrentUser } from '@auth/user.decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { AddVocabularyToCollectionInput } from './entities/input/add-vocabulary-to-collection.input';
import { CreateCollectionInput } from './entities/input/create-collection.input';
import { UserCollectionConnection } from './entities/object-type/user-collection.connection';
import { UserCollectionType } from './entities/object-type/user-collection.type';
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

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async addVocabularyToCollection(
    @Args('addVocabularyToCollectionInput')
    input: AddVocabularyToCollectionInput,
  ) {
    await this.userCollectionService.addVocabularyToCollection(input);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async createSelfCollection(
    @Args('createCollectionInput') input: CreateCollectionInput,
    @CurrentUser() user: UserFromAuth,
  ) {
    const collection = await this.userCollectionService.createOne(input);

    await this.userCollectionService.assignCollectionToUser(
      collection,
      user.id,
    );
    return true;
  }

  @Query(() => UserCollectionConnection, {
    name: 'selfCollections',
  })
  @UseGuards(JwtAuthGuard)
  async findSelfCollections(@Args() paginationArgs: PaginationArgs) {
    return this.userCollectionService.findMany(paginationArgs);
  }
}
