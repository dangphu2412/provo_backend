import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateVocabDto {
  @Field()
  @IsString()
  readonly word: string;

  @Field(() => [String])
  @IsString({
    each: true,
  })
  readonly definitions: string[];

  @Field(() => [String])
  readonly examples: string[];
}
