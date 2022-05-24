import { LeanDocument } from 'mongoose';
import { LearningRoadmap } from './model/learning-roadmap.model';
import { IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Questionnaire } from '@questionnaire-client/entities/questionnaire.model';

export class CreateProviderCollectionDto {
  @IsString()
  name: string;

  @IsNumber()
  fee: number;

  @Exclude()
  roadmaps: LeanDocument<LearningRoadmap>[];

  @Exclude()
  basedQuestionnaires: Record<string, LeanDocument<Questionnaire>[]>;
}
