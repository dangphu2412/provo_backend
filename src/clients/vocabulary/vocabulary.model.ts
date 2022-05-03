import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface VocabularyDocument extends Document {
  definition: string;
  word: string;
  examples: string[];
}

@Schema()
export class Vocabulary {
  @Prop()
  definition: string;

  @Prop({
    type: String,
    index: 'text',
  })
  word: string;

  @Prop()
  examples: string[];
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
