import { Vocabulary } from '@vocabulary-client/vocabulary.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserCollectionDocument = UserCollection & Document;

@Schema()
export class UserCollection {
  @Prop({ type: [{ type: Types.ObjectId, ref: Vocabulary.name }] })
  vocabularies: Vocabulary[];
}

export const UserCollectionSchema =
  SchemaFactory.createForClass(UserCollection);
