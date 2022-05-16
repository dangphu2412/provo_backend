import { Field, ObjectType } from '@nestjs/graphql';
import { DefinitionType } from './definition.type';

@ObjectType()
export class VocabularyType {
  @Field()
  _id: string;

  @Field()
  word: string;

  @Field(() => [DefinitionType])
  definitions: DefinitionType[];
}
