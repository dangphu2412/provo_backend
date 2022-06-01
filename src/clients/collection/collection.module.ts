import { UserPaidCollectionServiceToken } from './service/user-paid-collection.service';
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
  SelfLearningCollection,
  SelfLearningCollectionSchema,
} from './entities/model/self-learning-collection.model';
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
      {
        name: SelfLearningCollection.name,
        schema: SelfLearningCollectionSchema,
      },
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
    {
      provide: UserPaidCollectionServiceToken,
      useClass: ProviderCollectionServiceImpl,
    },
  ],
  exports: [ProviderCollectionServiceToken, SelfLearningCollectionServiceToken],
})
export class CollectionModule {}
