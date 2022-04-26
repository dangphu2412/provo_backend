import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabularyServiceImpl } from '@vocabulary/vocabulary.service';
import { CsvParser } from './vocab-excel-proccessor';
import { Vocabulary, VocabularySchema } from './vocabulary.model';
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
    CsvParser,
    {
      provide: VocabularyServiceToken,
      useClass: VocabularyServiceImpl,
    },
  ],
  exports: [VocabularyServiceToken],
})
export class VocabularyModule {}
