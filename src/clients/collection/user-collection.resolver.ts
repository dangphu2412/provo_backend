import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UserCollectionConnection } from './dto/user-collection.connection';
import {
  UserCollectionService,
  UserCollectionServiceToken,
} from './service/user-collection.service';

@Resolver()
export class UserCollectionResolver {
  constructor(
    @Inject(UserCollectionServiceToken)
    private readonly userCollectionService: UserCollectionService,
  ) {}

  @Query(() => UserCollectionConnection, {
    name: 'selfCollections',
  })
  getSelfCollections(@Args() args: PaginationArgs) {
    return this.userCollectionService.findMany(args);
  }

  @Mutation(() => Boolean)
  async createSelfCollection(
    @Args('createCollectionDto') dto: CreateCollectionDto,
  ) {
    await this.userCollectionService.createOne(dto);
    return true;
  }
}
