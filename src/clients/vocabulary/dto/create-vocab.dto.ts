import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { DefinitionDto } from './definition.dto';

@InputType()
export class CreateVocabDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  public word: string;

  @Field(() => [DefinitionDto])
  @ValidateNested({ each: true })
  @Type(() => DefinitionDto)
  public definitions: DefinitionDto[];
}
