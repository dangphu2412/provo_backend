import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateVocabDto {
  @Field()
  readonly word: string;

  @Field()
  readonly definition: string;

  @Field(() => [String])
  readonly examples: string[];
}
