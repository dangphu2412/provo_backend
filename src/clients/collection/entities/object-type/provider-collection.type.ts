import { Field, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class ProviderCollectionType {
  @Field()
  _id: string;

  @Field()
  fee: number;

  @Field()
  name: string;

  roadmaps: Record<string, Types.ObjectId[]>;
}
