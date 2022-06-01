import { UserPaidCollection } from '@collection-client/entities/model/user-paid-collection.model';
import { LearningStatus } from '@collection-client/learning-status.enum';
import {
  ProviderCollectionService,
  ProviderCollectionServiceToken,
} from '@collection-client/service/provider-collection.service';
import { UserPaidCollectionService } from '@collection-client/service/user-paid-collection.service';
import { Inject, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserService, UserServiceToken } from '@user-client/user.service';
import { Model } from 'mongoose';

export class UserPaidCollectionServiceImpl
  implements UserPaidCollectionService
{
  constructor(
    @InjectModel(UserPaidCollection.name)
    private readonly userPaidCollection: Model<UserPaidCollection>,
    @Inject(UserServiceToken)
    private readonly userService: UserService,
    @Inject(ProviderCollectionServiceToken)
    private readonly providerCollectionService: ProviderCollectionService,
  ) {}

  async buyCollectionByUser(
    providerCollectionId: string,
    userId: string,
  ): Promise<void> {
    const [user, providerCollection] = await Promise.all([
      this.userService.findById(userId),
      this.providerCollectionService.findById(providerCollectionId),
    ]);

    if (!user || !providerCollection) {
      throw new UnprocessableEntityException(
        'Process payment failed. User or provider collection not found.',
      );
    }

    if (user.credit - providerCollection.fee < 0) {
      throw new UnprocessableEntityException(
        'Process payment failed. User has not enough credit.',
      );
    }

    const isCollectionBought = user.paidProviderCollectionIds.some(
      (paidCollectionId) => paidCollectionId.equals(providerCollection._id),
    );

    if (isCollectionBought) {
      throw new UnprocessableEntityException(
        'Process payment failed. User has already bought this collection.',
      );
    }

    const newUserPaidCollection = await this.userPaidCollection.create({
      learningStatus: LearningStatus.ON_GOING,
      learningDay: 0,
      questionnaires: providerCollection.basedQuestionnaires,
    });

    user.paidProviderCollectionIds.push(providerCollection._id);
    user.paidCollections.push(newUserPaidCollection._id);

    await this.userService.updateOne(user);
  }
}
