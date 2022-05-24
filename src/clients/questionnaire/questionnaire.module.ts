import { Module } from '@nestjs/common';
import { QuestionnaireServiceImpl } from '@questionnaire/questionnaire.service';
import { VocabularyModule } from '@vocabulary-client/vocabulary.module';
import { QuestionnaireServiceToken } from './questionnaire.service';

@Module({
  imports: [VocabularyModule],
  providers: [
    {
      provide: QuestionnaireServiceToken,
      useClass: QuestionnaireServiceImpl,
    },
  ],
  exports: [QuestionnaireServiceToken],
})
export class QuestionnaireModule {}
