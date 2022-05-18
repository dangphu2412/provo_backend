import { UserCollection } from '@collection-client/entities/model/user-collection.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  avatarSrc: string;

  @Prop()
  credit: number;

  @Prop({ type: [Types.ObjectId], ref: UserCollection.name })
  ownedCollections: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
