import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Questionnaire extends Document {
  @Prop({
    required: true,
  })
  question: string;

  @Prop({
    type: [String],
    required: true,
  })
  answers: string[];

  @Prop({
    required: true,
  })
  correctAnswer: string;
}

export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
