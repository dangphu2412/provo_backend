import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Vocabulary,
  VocabularySchema,
} from '@vocabulary-client/vocabulary.model';
import { Document } from 'mongoose';

@Schema()
export class UserCollection extends Document {
  @Prop()
  name: string;

  @Prop({
    type: [VocabularySchema],
  })
  vocabularies: Vocabulary[];
}

export const UserCollectionSchema =
  SchemaFactory.createForClass(UserCollection);
