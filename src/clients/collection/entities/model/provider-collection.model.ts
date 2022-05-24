import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Questionnaire,
  QuestionnaireSchema,
} from '@questionnaire-client/entities/questionnaire.model';
import { Document } from 'mongoose';
import { LearningRoadmap } from './learning-roadmap.model';

@Schema()
export class ProviderCollection extends Document {
  @Prop({
    unique: true,
  })
  name: string;

  @Prop()
  fee: number;

  @Prop({ type: Array, of: LearningRoadmap })
  roadmaps: LearningRoadmap[];

  @Prop({ type: Map, of: [QuestionnaireSchema] })
  basedQuestionnaires: Record<string, Questionnaire[]>;
}

export const ProviderCollectionSchema =
  SchemaFactory.createForClass(ProviderCollection);
