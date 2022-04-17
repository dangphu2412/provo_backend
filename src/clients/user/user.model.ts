import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  email: number;

  @Prop()
  avatarSrc: string;

  @Prop()
  credit: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
