import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface VocabularyDocument extends Document {
  word: string;
  definitions: Definition[];
}

export interface Definition {
  meaning: string;
  type: string;
  examples: string[];
}

@Schema()
export class Vocabulary {
  @Prop({
    type: String,
    unique: true,
  })
  word: string;

  @Prop({
    type: [
      {
        meaning: { type: String },
        type: { type: String },
        examples: { type: [String] },
      },
    ],
  })
  definitions: Definition[];
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
