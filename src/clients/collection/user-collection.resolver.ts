import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
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

  @Query(() => UserCollectionConnection)
  findPurchaseCollections(@Args() args: PaginationArgs) {
    return this.userCollectionService.findMany(args);
  }
}
