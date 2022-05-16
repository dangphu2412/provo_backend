import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VocabularyDocument = Vocabulary & Document;

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
