import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Definition, DefinitionSchema } from './definition.model';

@Schema()
export class Vocabulary extends Document {
  @Prop({
    type: String,
    unique: true,
  })
  word: string;

  @Prop({
    type: [DefinitionSchema],
  })
  definitions: Definition[];
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
