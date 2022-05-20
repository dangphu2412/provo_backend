import { Module } from '@nestjs/common';
import { QuestionnaireServiceImpl } from '@questionnaire/questionnaire.service';
import { QuestionnaireServiceToken } from './questionnaire.service';

@Module({
  providers: [
    {
      provide: QuestionnaireServiceToken,
      useClass: QuestionnaireServiceImpl,
    },
  ],
})
export class QuestionnaireModule {}
