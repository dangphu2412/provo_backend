import { ProviderCollectionServiceImpl } from '@collection/purchase-collection.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProviderCollection,
  ProviderCollectionSchema,
} from './model/provider-collection.model';
import { PurchaseCollectionResolver } from './provider-collection.resolver';
import { ProviderCollectionServiceToken } from './service/provider-collection.service';
import {
  UserCollection,
  UserCollectionSchema,
} from './model/user-collection.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderCollection.name, schema: ProviderCollectionSchema },
      { name: UserCollection.name, schema: UserCollectionSchema },
    ]),
  ],
  providers: [
    PurchaseCollectionResolver,
    {
      provide: ProviderCollectionServiceToken,
      useClass: ProviderCollectionServiceImpl,
    },
  ],
  exports: [ProviderCollectionServiceToken],
})
export class CollectionModule {}
