import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Questionnaire,
  QuestionnaireSchema,
} from '@questionnaire-client/entities/questionnaire.model';
import { Document, Types } from 'mongoose';

@Schema()
export class ProviderCollection extends Document {
  @Prop({
    unique: true,
  })
  name: string;

  @Prop()
  fee: number;

  @Prop({ type: Map, of: [Types.ObjectId] })
  roadmaps: Map<string, Types.ObjectId[]>;

  @Prop({ type: Map, of: [QuestionnaireSchema] })
  basedQuestionnaires: Map<string, Questionnaire[]>;
}

export const ProviderCollectionSchema =
  SchemaFactory.createForClass(ProviderCollection);
