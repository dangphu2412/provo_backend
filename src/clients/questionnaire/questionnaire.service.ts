import { LearningRoadmap } from '@collection-client/entities/model/learning-roadmap.model';
import { LeanDocument } from 'mongoose';
import { Questionnaire } from './entities/questionnaire.model';

export const QuestionnaireServiceToken = 'QuestionnaireServiceToken';

export interface QuestionnaireService {
  createBasedQuestionnaires(
    roadmaps: LeanDocument<LearningRoadmap>[],
  ): Promise<Record<string, LeanDocument<Questionnaire>[]>>;
}
