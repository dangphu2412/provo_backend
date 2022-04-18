import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VocabularyDocument = Vocabulary & Document;

@Schema({
  autoIndex: true,
})
export class Vocabulary {
  _id: Types.ObjectId;

  @Prop()
  definition: string;

  @Prop({
    type: String,
    index: 'text',
    unique: true,
  })
  word: string;

  @Prop()
  examples: string[];
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
