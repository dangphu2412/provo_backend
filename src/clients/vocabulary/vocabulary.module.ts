import { VocabularyServiceToken } from './vocabulary.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './vocabulary.model';
import { VocabularyServiceImpl } from '@vocabulary/vocabulary.service';
import { VocabularyResolver } from './vocabulary.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
  ],
  providers: [
    VocabularyResolver,
    {
      provide: VocabularyServiceToken,
      useClass: VocabularyServiceImpl,
    },
  ],
  exports: [VocabularyServiceToken],
})
export class VocabularyModule {}
