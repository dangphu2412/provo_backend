import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Vocabulary,
  VocabularySchema,
} from '@vocabulary-client/entities/model/vocabulary.model';
import { Document } from 'mongoose';

@Schema()
export class SelfLearningCollection extends Document {
  @Prop()
  name: string;

  @Prop({
    type: [VocabularySchema],
  })
  vocabularies: Vocabulary[];
}

export const SelfLearningCollectionSchema = SchemaFactory.createForClass(
  SelfLearningCollection,
);
