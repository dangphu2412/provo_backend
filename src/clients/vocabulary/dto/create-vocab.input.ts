import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { DefinitionInput } from './definition.input';

@InputType()
export class CreateVocabInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  public word: string;

  @Field(() => [DefinitionInput])
  @ValidateNested({ each: true })
  @Type(() => DefinitionInput)
  public definitions: DefinitionInput[];
}
