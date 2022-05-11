import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCollectionDto {
  @Field()
  @IsNotEmpty()
  name: string;
}
