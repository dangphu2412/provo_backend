import { Vocabulary } from '@vocabulary-client/entities/model/vocabulary.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ProviderCollection extends Document {
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
