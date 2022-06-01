import { UserFromAuth } from '@auth-client/entities/current-user';
import { AuthenticateRequired } from '@auth/authenticate-required.decorator';
import { CurrentUser } from '@auth/user.decorator';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PayCollectionInput } from './entities/input/pay-collection.input';
import {
  UserPaidCollectionService,
  UserPaidCollectionServiceToken,
} from './service/user-paid-collection.service';

@Resolver()
export class UserPaidCollectionResolver {
  constructor(
    @Inject(UserPaidCollectionServiceToken)
    private readonly userPaidCollectionService: UserPaidCollectionService,
  ) {}

  @Mutation(() => Boolean, { nullable: true })
  @AuthenticateRequired
  async buyCollection(
    @Args('payCollectionInput') payCollectionInput: PayCollectionInput,
    @CurrentUser() user: UserFromAuth,
  ) {
    await this.userPaidCollectionService.buyCollectionByUser(
      payCollectionInput.providerCollectionId,
      user.id,
    );
  }
}
