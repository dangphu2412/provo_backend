import { Field, ObjectType } from '@nestjs/graphql';
import { VocabularyType } from '@vocabulary-client/dto/vocabulary.type';

@ObjectType()
export class ProviderCollectionType {
  @Field()
  _id: string;

  @Field(() => [VocabularyType])
  vocabularies: VocabularyType[];

  @Field()
  fee: number;
}
