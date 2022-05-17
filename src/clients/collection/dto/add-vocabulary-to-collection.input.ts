import { Field, InputType } from '@nestjs/graphql';
import { CreateVocabDto } from '@vocabulary-client/dto/create-vocab.dto';
import { Type } from 'class-transformer';
import { IsMongoId, ValidateNested } from 'class-validator';

@InputType()
export class AddVocabularyToCollectionInput {
  @Field()
  @IsMongoId()
  id: string;

  @Field(() => CreateVocabDto)
  @ValidateNested()
  @Type(() => CreateVocabDto)
  createVocabDto: CreateVocabDto;
}
