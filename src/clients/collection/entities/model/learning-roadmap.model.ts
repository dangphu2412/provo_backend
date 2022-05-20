import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Vocabulary } from '@vocabulary-client/entities/model/vocabulary.model';
import { Document, Types } from 'mongoose';

@Schema()
export class LearningRoadmap extends Document {
  @Prop({
    required: true,
  })
  day: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: Vocabulary.name }] })
  vocabularies: Vocabulary[];
}

export const LearningRoadmapSchema =
  SchemaFactory.createForClass(LearningRoadmap);
