import { Role } from '@auth/auth.constant';
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

  @Prop({
    type: [String],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
