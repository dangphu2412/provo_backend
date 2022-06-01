import { Role } from '@auth/auth.constant';
import { SelfLearningCollection } from '@collection-client/entities/model/self-learning-collection.model';
import { UserPaidCollection } from '@collection-client/entities/model/user-paid-collection.model';
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

  @Prop({ type: [Types.ObjectId], ref: SelfLearningCollection.name })
  ownedCollections: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: UserPaidCollection.name })
  paidCollections: Types.ObjectId[];

  @Prop({ type: Array, of: Types.ObjectId })
  paidProviderCollectionIds: Types.ObjectId[];

  @Prop({
    type: [String],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
