import { Field, ObjectType } from '@nestjs/graphql';
import { VocabularyType } from '@vocabulary-client/dto/vocabulary.type';

@ObjectType()
export class UserCollectionType {
  @Field()
  _id: string;

  @Field(() => [VocabularyType])
  vocabularies: VocabularyType[];
}
