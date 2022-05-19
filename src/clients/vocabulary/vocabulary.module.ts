import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabularyServiceImpl } from '@vocabulary/vocabulary.service';
import { VocabularyLoader } from '@vocabulary/vocabulary-loader';
import {
  Vocabulary,
  VocabularySchema,
} from './entities/model/vocabulary.model';
import { VocabularyResolver } from './vocabulary.resolver';
import { VocabularyServiceToken } from './vocabulary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
  ],
  providers: [
    VocabularyResolver,
    VocabularyLoader,
    {
      provide: VocabularyServiceToken,
      useClass: VocabularyServiceImpl,
    },
  ],
  exports: [VocabularyServiceToken, VocabularyLoader],
})
export class VocabularyModule {}
