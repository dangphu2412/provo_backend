import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VocabularyType {
  @Field()
  _id: string;

  @Field()
  definition: string;

  @Field()
  word: string;

  @Field(() => [String])
  examples: string[];
}
