import { IsMongoId } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PayCollectionInput {
  @Field()
  @IsMongoId()
  providerCollectionId: string;
}
