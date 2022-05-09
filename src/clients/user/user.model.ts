import { UserCollection } from '@collection-client/model/user-collection.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  avatarSrc: string;

  @Prop()
  credit: number;

  @Prop({ type: [Types.ObjectId], ref: UserCollection.name })
  ownedCollections?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
