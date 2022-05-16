import { Vocabulary } from '@vocabulary-client/vocabulary.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProviderCollectionDocument = ProviderCollection & Document;

@Schema()
export class ProviderCollection {
  @Prop({ type: [{ type: Types.ObjectId, ref: Vocabulary.name }] })
  vocabularies: Vocabulary[];

  @Prop({
    unique: true,
  })
  name: string;

  @Prop()
  fee: number;
}

export const ProviderCollectionSchema =
  SchemaFactory.createForClass(ProviderCollection);
