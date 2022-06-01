import { LearningStatus } from '../../learning-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  QuestionnaireSchema,
  Questionnaire,
} from '@questionnaire-client/entities/questionnaire.model';
import { Document } from 'mongoose';

@Schema()
export class UserPaidCollection extends Document {
  @Prop({
    enum: Object.values(LearningStatus),
    default: LearningStatus.ON_GOING,
  })
  learningStatus: LearningStatus;

  @Prop()
  learningDay: number;

  @Prop({ type: Map, of: [QuestionnaireSchema] })
  questionnaires: Record<string, Questionnaire[]>;
}

export const UserPaidCollectionSchema =
  SchemaFactory.createForClass(UserPaidCollection);
