import { SyncSheetToProviderCollectionToken } from './service/sync-sheet-to-provider-collection';
import { ProviderCollectionServiceImpl } from '@collection/provider-collection.service';
import { SelfLearningCollectionServiceImpl } from '@collection/self-learning-collection.service';
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
import { SelfLearningCollectionServiceToken } from './service/self-learning-collection.service';
import { SelfLearningCollectionResolver } from './self-learning-collection.resolver';
import { SyncSheetToProviderCollectionImpl } from '@collection/sync-sheet-to-provider-collection';
import { QuestionnaireModule } from '@questionnaire-client/questionnaire.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderCollection.name, schema: ProviderCollectionSchema },
      { name: UserCollection.name, schema: UserCollectionSchema },
    ]),
    VocabularyModule,
    UserModule,
    QuestionnaireModule,
  ],
  providers: [
    ProviderCollectionResolver,
    SelfLearningCollectionResolver,
    {
      provide: ProviderCollectionServiceToken,
      useClass: ProviderCollectionServiceImpl,
    },
    {
      provide: SelfLearningCollectionServiceToken,
      useClass: SelfLearningCollectionServiceImpl,
    },
    {
      provide: SyncSheetToProviderCollectionToken,
      useClass: SyncSheetToProviderCollectionImpl,
    },
  ],
  exports: [ProviderCollectionServiceToken, SelfLearningCollectionServiceToken],
})
export class CollectionModule {}
