import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  avatarSrc: string;

  @Prop()
  credit: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
