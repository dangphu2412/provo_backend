import { Field, ObjectType } from '@nestjs/graphql';
import { VocabularyType } from '@vocabulary-client/entities/object-type/vocabulary.type';

@ObjectType()
export class UserCollectionType {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(() => [VocabularyType])
  vocabularies: VocabularyType[];
}
