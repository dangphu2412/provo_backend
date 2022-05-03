import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { ProviderCollectionConnection } from './dto/provider-collection.connection';
import {
  ProviderCollectionService,
  ProviderCollectionServiceToken,
} from './service/provider-collection.service';

@Resolver()
export class PurchaseCollectionResolver {
  constructor(
    @Inject(ProviderCollectionServiceToken)
    private readonly providerCollectionService: ProviderCollectionService,
  ) {}

  @Query(() => ProviderCollectionConnection)
  findPurchaseCollections(@Args() args: PaginationArgs) {
    return this.providerCollectionService.findMany(args);
  }
}
