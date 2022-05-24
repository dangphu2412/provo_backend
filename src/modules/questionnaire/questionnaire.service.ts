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
import { randomInt } from 'crypto';
import { shuffle } from 'lodash';
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

    await Promise.all(
      roadmaps.map(async (roadmap) => {
        const vocabularies = await this.vocabularyService.findByIds(
          roadmap.vocabularies,
        );

        basedQuestionnaires[roadmap.day] =
          this.createQuestionnaires(vocabularies);
      }),
    );

    return basedQuestionnaires;
  }

  private createQuestionnaires(
    vocabularies: LeanDocument<Vocabulary & ObjectId>[],
  ): LeanDocument<Questionnaire>[] {
    const questionnaires: LeanDocument<Questionnaire>[] = [];

    vocabularies.forEach((vocabulary, answerIndex) => {
      const definitionQuestion: LeanDocument<Questionnaire> = {
        question: vocabulary.definitions[0].meaning,
        answers: this.generateAnswers(answerIndex, vocabularies),
        correctAnswer: vocabulary.word,
      };

      // TODO: Develop generate question based on example - current dataset is missing example

      questionnaires.push(definitionQuestion);
    });

    return questionnaires;
  }

  private generateAnswers(
    correctAnswerIndex: number,
    vocabsToRandom: LeanDocument<Vocabulary & ObjectId>[],
  ): string[] {
    const ANSWER_SIZE = 4;
    const setAnswerIndices = new Set([correctAnswerIndex]);
    const answers: string[] = [];

    while (setAnswerIndices.size < ANSWER_SIZE) {
      const randomIndex = randomInt(0, vocabsToRandom.length - 1);
      setAnswerIndices.add(randomIndex);
    }

    for (const answerIndex of setAnswerIndices.values()) {
      answers.push(vocabsToRandom[answerIndex].word);
    }

    return shuffle(answers);
  }
}
