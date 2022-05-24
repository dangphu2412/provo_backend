import { LearningRoadmap } from '@collection-client/entities/model/learning-roadmap.model';
import { ObjectId } from '@mongoose/type';
import { Inject } from '@nestjs/common';
import { Questionnaire } from '@questionnaire-client/entities/questionnaire.model';
import { QuestionnaireService } from '@questionnaire-client/questionnaire.service';
import { Vocabulary } from '@vocabulary-client/entities/model/vocabulary.model';
import {
  VocabularyService,
  VocabularyServiceToken,
} from '@vocabulary-client/vocabulary.service';
import { LeanDocument } from 'mongoose';

export class QuestionnaireServiceImpl implements QuestionnaireService {
  constructor(
    @Inject(VocabularyServiceToken)
    private readonly vocabularyService: VocabularyService,
  ) {}

  public async createBasedQuestionnaires(
    roadmaps: LeanDocument<LearningRoadmap>[],
  ): Promise<Record<string, LeanDocument<Questionnaire>[]>> {
    const basedQuestionnaires: Record<string, LeanDocument<Questionnaire>[]> =
      {};

    for (const roadmap of roadmaps) {
      const vocabularies = await this.vocabularyService.findByIds(
        roadmap.vocabularies,
      );
      basedQuestionnaires[roadmap.day] =
        this.createQuestionnaires(vocabularies);
    }

    return basedQuestionnaires;
  }

  private createQuestionnaires(
    vocabularies: LeanDocument<Vocabulary & ObjectId>[],
  ): LeanDocument<Questionnaire>[] {
    const questionnaires: LeanDocument<Questionnaire>[] = [];

    vocabularies.forEach((vocabulary) => {
      const definitionQuestion: LeanDocument<Questionnaire> = {
        question: vocabulary.definitions[0].meaning,
        answers: [vocabulary.word],
        correctAnswer: vocabulary.word,
      };
      // TODO: Develop generate question based on example
      // const exampleQuestion: LeanDocument<Questionnaire> = {
      //   question: vocabulary.definitions[0].examples[0],
      //   answers: [vocabulary.word],
      //   correctAnswer: vocabulary.word,
      // };
      questionnaires.push(definitionQuestion);
    });

    return questionnaires;
  }
}
