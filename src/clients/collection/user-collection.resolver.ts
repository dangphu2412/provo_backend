import { JwtPayload } from '@auth-client/entities/jwt-payload';
import { JwtAuthGuard } from '@auth/jwt.guard';
import { CurrentUser } from '@auth/user.decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { AddVocabularyToCollectionInput } from './dto/add-vocabulary-to-collection.input';
import { CreateCollectionInput } from './dto/create-collection.input';
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
  @UseGuards(JwtAuthGuard)
  async getSelfCollections(@Args() args: PaginationArgs) {
    return this.userCollectionService.findMany(args);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async createSelfCollection(
    @Args('createCollectionInput') dto: CreateCollectionInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const collection = await this.userCollectionService.createOne(dto);
    await this.userCollectionService.assignCollectionToUser(
      collection,
      user.sub,
    );
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async addVocabularyToCollection(
    @Args('addVocabularyToCollectionInput')
    input: AddVocabularyToCollectionInput,
  ) {
    await this.userCollectionService.addVocabularyToCollection(input);
    return true;
  }
}
