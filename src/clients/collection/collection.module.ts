import { ProviderCollectionServiceImpl } from '@collection/provider-collection.service';
import { UserCollectionServiceImpl } from '@collection/user-collection.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@user-client/user.module';
import { VocabularyModule } from '@vocabulary-client/vocabulary.module';
import {
  ProviderCollection,
  ProviderCollectionSchema,
} from './entities/model/provider-collection.model';
import {
  UserCollection,
  UserCollectionSchema,
} from './entities/model/user-collection.model';
import { ProviderCollectionResolver } from './provider-collection.resolver';
import { ProviderCollectionServiceToken } from './service/provider-collection.service';
import { UserCollectionServiceToken } from './service/user-collection.service';
import { UserCollectionResolver } from './user-collection.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderCollection.name, schema: ProviderCollectionSchema },
      { name: UserCollection.name, schema: UserCollectionSchema },
    ]),
    VocabularyModule,
    UserModule,
  ],
  providers: [
    ProviderCollectionResolver,
    UserCollectionResolver,
    {
      provide: ProviderCollectionServiceToken,
      useClass: ProviderCollectionServiceImpl,
    },
    {
      provide: UserCollectionServiceToken,
      useClass: UserCollectionServiceImpl,
    },
  ],
  exports: [ProviderCollectionServiceToken, UserCollectionServiceToken],
})
export class CollectionModule {}
