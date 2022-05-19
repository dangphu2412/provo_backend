import { Field, InputType } from '@nestjs/graphql';
import { CreateVocabInput } from '@vocabulary-client/entities/input/create-vocab.input';
import { Type } from 'class-transformer';
import { IsMongoId, ValidateNested } from 'class-validator';

@InputType()
export class AddVocabularyToCollectionInput {
  @Field()
  @IsMongoId()
  id: string;

  @Field(() => CreateVocabInput)
  @ValidateNested()
  @Type(() => CreateVocabInput)
  createVocabDto: CreateVocabInput;
}
