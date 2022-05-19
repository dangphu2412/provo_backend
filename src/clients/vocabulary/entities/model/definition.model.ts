import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Definition extends Document {
  @Prop()
  meaning: string;

  @Prop()
  type: string;

  @Prop(() => [String])
  examples: string[];
}

export const DefinitionSchema = SchemaFactory.createForClass(Definition);
