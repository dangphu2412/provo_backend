import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface VocabularyDocument extends Document {
  definitions: string[];
  word: string;
  examples: string[];
}

@Schema()
export class Vocabulary {
  @Prop({
    type: [String],
  })
  definitions: string[];

  @Prop({
    type: String,
    unique: true,
  })
  word: string;

  @Prop()
  examples: string[];
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
