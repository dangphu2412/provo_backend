import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateVocabDto {
  @Field()
  @IsString()
  readonly word: string;

  @Field()
  @IsString()
  readonly definition: string;

  @Field(() => [String])
  readonly examples: string[];
}
